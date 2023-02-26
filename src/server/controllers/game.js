import Player from "../models/player";
import Game from "../models/game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";

export default {
    getAll(req, res) {
        res.sendJSON(Game.getAll());
    },

    create(io, socket, hostId) {
        const player = new Player(hostId);
        const game = Game.create(player);

        io.emit(GAME_SOCKET_EVENT.CREATE, game);
        console.log('here3');

        this.connect(io, socket, game.id, player.id);
    },

    connect(io, socket, gameId, playerId) {
        const game = Game.get(gameId);
        console.log('here2', gameId, playerId);
        if (!game) {
            return;
        }
        const isHost = game.host.id === playerId;
        // @TODO коннект на другую игру если ты в игре
        const player = isHost ? game.host : new Player(playerId);

        game.connect(player);
        socket.join(gameId);
        this._listenGameEvents(socket, gameId);
        io.to(gameId).emit(GAME_SOCKET_EVENT.CONNECT, {game, player});
    },

    start() {

    },

    restart() {
    },

    update() {

    },
    
    hostChange() {
        
    },

    kick() {

    },

    disconnect() {

    },

    join() {

    },
    
    _listenGameEvents(socket, gameId) {
        socket.on(GAME_SOCKET_EVENT.START, this.start);
        socket.on(GAME_SOCKET_EVENT.RESTART, this.restart);
        socket.on(GAME_SOCKET_EVENT.UPDATE, this.update);
        socket.on(GAME_SOCKET_EVENT.HOST_CHANGE, this.hostChange);
        socket.on(GAME_SOCKET_EVENT.KICK, this.kick);
    }
};