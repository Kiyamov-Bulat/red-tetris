import Tetramino from "../src/server/models/tetramino";
import {TETRAMINO_TYPE} from "../src/utils/constants";
import GameModel from "../src/client/models/game";
import gameController from '../src/server/controllers/game';

const createClient = () => {
};

describe.skip('game full imitation', () => {
    it('singlePlayer', () => {

    });

    it('multiPlayer', () => {
        Tetramino._setGeneratorType(TETRAMINO_TYPE.I);
        const toEmit = { emit: jest.fn() };
        const server = { on: jest.fn(), emit: jest.fn(), to: jest.fn(() => toEmit)};
        const clients = [];

        gameController.kick();
        game.host = players[0];
        game.players = [...players];
        game.isStarted = true;
        game.isOver = false;
        GameModel.onCreate(game);
    });
});