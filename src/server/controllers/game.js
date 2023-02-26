import Player from "../models/player";
import Game from "../models/game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import Field from "../models/field";

export default {
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
        // @TODO коннект на другую игру если ты в игре
        const player = isHost ? game.host : new Player(playerId, socket);

        game.connect(player);
        socket.join(gameId);
        this._listenGameEvents(io, player, gameId);
        io.to(gameId).emit(GAME_SOCKET_EVENT.CONNECT, {game, player});
    },

    start(io, player, gameId) {
        io.to(gameId).emit(GAME_SOCKET_EVENT.START);
    },

    restart(io, player, gameId) {
    },

    update(io, player, gameId, field) {
        const transformedField = Field.transformToSpectatorField(field);

        player.socket.broadcast.to(gameId).emit({ field: transformedField, player });
    },
    
    hostChange(io, player, gameId) {
        
    },

    kick(io, player, gameId) {

    },

    disconnect(io, player, gameId) {

    },

    join(io, player, gameId) {

    },
    
    _listenGameEvents(io, player, gameId) {
        const args = [this, io, player, gameId];
        const socket = player.socket;

        socket.on(GAME_SOCKET_EVENT.START, this.start.bind(...args));
        socket.on(GAME_SOCKET_EVENT.RESTART, this.restart.bind(...args));
        socket.on(GAME_SOCKET_EVENT.UPDATE, (field) => this.update(...args, field));
        socket.on(GAME_SOCKET_EVENT.HOST_CHANGE, this.hostChange.bind(...args));
        socket.on(GAME_SOCKET_EVENT.KICK, this.kick.bind(...args));
    }
};