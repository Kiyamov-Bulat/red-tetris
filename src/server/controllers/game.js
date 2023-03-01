import Player from "../models/player";
import Game from "../models/game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import Field from "../models/field";

export default {
    gameListeners: [],

    getAll(req, res) {
        res.sendJSON(Game.getAll());
    },

    create(io, socket, hostId) {
        const player = new Player(hostId, socket);
        const game = Game.create(player);

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

    disconnect(io, socket) {
        const { player } = socket;

        if (!player) {
            return;
        }

        const { game } = player;

        socket.player = null;
        socket.removeAllListeners();

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

        io.to(game.id).emit(GAME_SOCKET_EVENT.START);
        io.to(game.id).emit(GAME_SOCKET_EVENT.GENERATE_TETRAMINO, nextTetramino);
    },

    finish(io, player) {
        const { game } = player;
        
        if (!game || game.isOver || !game.isStarted) {
            return;
        }
        game.finish();
        io.to(game.id).emit(GAME_SOCKET_EVENT.FINISH);
    },

    update(io, player, field, collapsedLines) {
        const { game } = player;

        if (!game || game.isOver || !game.isStarted) {
            return;
        }

        const transformedField = Field.transformToSpectatorField(field);
        const nextTetramino = game.getNextTetramino(player.id);

        player.socket.broadcast.to(game.id).emit(GAME_SOCKET_EVENT.UPDATE, { field: transformedField, player, collapsedLines });
        player.socket.emit(GAME_SOCKET_EVENT.GENERATE_TETRAMINO, nextTetramino);
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
        game.disconnect(kickedPlayer);
        this._removeGameListeners(io, kickedPlayer.id);

        io.to(game.id).to(kickedPlayer.socket.id).emit(GAME_SOCKET_EVENT.KICK, game, kickedPlayer.id);
        kickedPlayer.socket.player = null;
    },

    _listenGameEvents(io, player) {
        const socket = player.socket;
        const wrapper = (cb) => cb.bind(this, io, player);

        this.gameListeners = [
            [GAME_SOCKET_EVENT.START, wrapper(this.start)],
            [GAME_SOCKET_EVENT.FINISH, wrapper(this.finish)],
            [GAME_SOCKET_EVENT.UPDATE, wrapper(this.update)],
            [GAME_SOCKET_EVENT.KICK, wrapper(this.kick)],
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