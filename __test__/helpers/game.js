import sessionStorageService from "../../src/client/services/sessionStorageService";
import {v4 as uuidv4} from "uuid";
import Player from "../../src/server/models/player";
import Game from "../../src/server/models/game";

export const getCurrentUser = () => (
    { name: 'Noob', id: sessionStorageService.getSessionId() }
);

export const getMockPlayer = () => (
    { name: 'Noob', id: uuidv4() }
);

export const getMockGame = () => {
    const mock = {};

    mock.host = getCurrentUser();
    mock.id = uuidv4();
    mock.createdAt = new Date().toISOString();
    mock.players = [];
    mock.tetraminoQueue = [];
    mock.isStarted = false;
    mock.isOver = false;
    return mock;
};

export const createPlayer = (aSocket) => {
    const socket = aSocket || { id: Math.random(), join: jest.fn(), leave: jest.fn() };

    return new Player(Math.random(), socket);
};
export const createGame = () => {
    return Game.create(createPlayer());
};
