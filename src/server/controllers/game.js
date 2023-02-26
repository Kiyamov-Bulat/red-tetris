import Player from "../models/player";
import Game from "../models/game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";

export default {
    getAll(req, res) {
        res.sendJSON(Game.getAll());
    },

    async create(io, req, res) {
        // @TODO validation
        const { hostId } = await req.getJSONBody();
        const game = Game.create(new Player(hostId));

        socket.broadcast.emit(GAME_SOCKET_EVENT.CREATE, game);

        this._listenGameEvents(socket, game.id);
        res.sendJSON(res);
    },

    async connect(socket, req, res) {
        // @TODO validation
        const { playerId, gameId } = await req.getJSONBody();
        const game = Game.get(gameId);

        if (!game) {
            return;
        }
        const player = new Player(playerId);

        game.connect(player);

        const response = { game, player };

        socket.to(gameId).emit(GAME_SOCKET_EVENT.CONNECT, response);
        this._listenGameEvents(socket, gameId);
        res.sendJSON(response);
    },

    start() {

    },

    restart() {
    },
    
    hostChange() {
        
    },

    kick() {

    },

    disconnect() {

    },
    
    _listenGameEvents(socket, gameId) {
        const game = socket.to(gameId);
        
        game.on(GAME_SOCKET_EVENT.START, this.start);
        game.on(GAME_SOCKET_EVENT.RESTART, this.restart);
        game.on(GAME_SOCKET_EVENT.UPDATE, this.update);
        game.on(GAME_SOCKET_EVENT.HOST_CHANGE, this.hostChange);
        game.on(GAME_SOCKET_EVENT.KICK, this.kick);
        game.on(GAME_SOCKET_EVENT.JOIN, this.join);
    }
};