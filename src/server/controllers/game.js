import Player from "../models/player";
import Game from "../models/game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import Field from "../models/field";

export default {
    gameListeners: [],

    getAll(req, res) {
        res.sendJSON(Game.getAllAvailable());
    },

    create(io, socket, hostId, mode) {
        const player = new Player(hostId, socket);
        const game = Game.create(player, mode);

        io.emit(GAME_SOCKET_EVENT.CREATE, game);

        this.connect(io, socket, game.id, player.id);
    },

    connect(io, socket, gameId, playerId) {
        const game = Game.get(gameId);

        if (!game) {
            return;
        }
        const isHost = game.host.id === playerId;
        const player = isHost ? game.host : new Player(playerId, socket);

        game.connect(player);
        this._listenGameEvents(io, player);

        io.to(gameId).emit(GAME_SOCKET_EVENT.CONNECT, game, player);
    },

    disconnect(io, socket, fromGame = false) {
        const { player } = socket;

        if (!player) {
            return;
        }

        const { game } = player;

        socket.player = null;

        if (fromGame) {
            this._removeGameListeners(socket);
        } else {
            socket.removeAllListeners();
        }

        if (!game) {
            return;
        }
        game.disconnect(player);

        switch (game.players.length) {
            case 0:
                game.destroy();
                io.emit(GAME_SOCKET_EVENT.DESTROY, game);
                return;
            case 1:
                if (game.isStarted) {
                    this.finish(io, game.players[0]);
                }
                break;
        }

        io.to(game.id).emit(GAME_SOCKET_EVENT.KICK, game, player.id);
    },

    start(io, player) {
        const { game } = player;

        if (!game || !game.isHost(player) || game.isStarted) {
            return;
        }

        const nextTetramino = game.start();
        const field = game.isRandomFilled ? Field.generateRandomFilled() : Field.getEmpty();

        io.emit(GAME_SOCKET_EVENT.START, game);
        io.to(game.id).emit(GAME_SOCKET_EVENT.GENERATE_TETRAMINO, nextTetramino, field);
    },

    finish(io, player) {
        const { game } = player;
        
        if (!game || game.isOver || !game.isStarted) {
            return;
        }
        game.finish();
        io.emit(GAME_SOCKET_EVENT.FINISH, game, game.getWinner(player));
    },

    update(io, player, field, collapsedLines) {
        const { game } = player;

        if (!game || game.isOver || !game.isStarted) {
            return;
        }

        const transformedField = Field.transformToSpectatorField(field);
        const nextTetramino = game.getNextTetramino(player.id);

        player.updateScore(collapsedLines);
        player.socket.broadcast.to(game.id).emit(GAME_SOCKET_EVENT.UPDATE, { field: transformedField, player, collapsedLines });
        player.socket.emit(GAME_SOCKET_EVENT.GENERATE_TETRAMINO, nextTetramino, player.score); // @TODO
    },
    
    kick(io, player, kickedPlayerId) {
        const { game } = player;

        if (!game || !game.isHost(player)) {
            return;
        }
        const kickedPlayer = game.players.find((next) => next.id === kickedPlayerId);

        if (!kickedPlayer) {
            return;
        }
        const socketId = kickedPlayer.socket.id;

        this.disconnect(io, kickedPlayer.socket, true);
        io.to(socketId).emit(GAME_SOCKET_EVENT.KICK, game, kickedPlayer.id);
    },

    leave(io, player) {
        this.disconnect(io, player.socket, true);
    },

    _listenGameEvents(io, player) {
        const socket = player.socket;
        const wrapper = (cb) => cb.bind(this, io, player);

        this.gameListeners = [
            [GAME_SOCKET_EVENT.START, wrapper(this.start)],
            [GAME_SOCKET_EVENT.FINISH, wrapper(this.finish)],
            [GAME_SOCKET_EVENT.UPDATE, wrapper(this.update)],
            [GAME_SOCKET_EVENT.KICK, wrapper(this.kick)],
            [GAME_SOCKET_EVENT.LEAVE, wrapper(this.leave)],
        ];
        for (const pair of this.gameListeners) {
            socket.on(...pair);
        }
    },

    _removeGameListeners(socket) {
        for (const pair of this.gameListeners) {
            socket.removeListener(...pair);
        }
    }
};