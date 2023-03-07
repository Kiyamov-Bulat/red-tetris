import sessionStorageService from "../../src/client/services/sessionStorageService";
import {v4 as uuidv4} from "uuid";
import Player from "../../src/server/models/player";
import Game from "../../src/server/models/game";
import {GAME_MODE} from "../../src/utils/constants";

export const getCurrentUser = () => (
    { name: 'Noob', id: sessionStorageService.getSessionId() }
);

export const getMockPlayer = () => (
    { name: 'Noob', id: uuidv4() }
);

export const getMockGame = (mode = GAME_MODE.COMMON) => {
    const mock = {};

    mock.host = getCurrentUser();
    mock.id = uuidv4();
    mock.createdAt = new Date().toISOString();
    mock.players = [];
    mock.tetraminoQueue = [];
    mock.isStarted = false;
    mock.isOver = false;
    mock.mode = mode;
    return mock;
};

export const createPlayer = (aSocket) => {
    const socket = aSocket || { id: Math.random(), join: jest.fn(), leave: jest.fn() };

    return new Player(Math.random(), socket);
};
export const createGame = () => {
    return Game.create(createPlayer());
};
