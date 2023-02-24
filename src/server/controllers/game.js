import Player from "../models/player";
import Game from "../models/game";

export default {
    async create(req, res) {
        const { playerId } = await req.getJSONBody();
        const game = Game.create(new Player(playerId));

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