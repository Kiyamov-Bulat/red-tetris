import Player from "../models/player";
import Game from "../models/game";

export default {
    getAll(req, res) {
        res.sendJSON(Game.getAll());
    },

    async create(req, res) {
        const { hostId } = await req.getJSONBody();
        const game = Game.create(new Player(hostId));

        res.sendJSON(game);
    },

    async connect(req, res) {
        const { playerId, gameId } = await req.getJSONBody();
    },

    async start(req, res) {
        const { gameId } = await req.getJSONBody();

    },

    async restart(req, res) {
        const { gameId } = await req.getJSONBody();

    }
};