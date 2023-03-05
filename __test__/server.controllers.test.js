import game from "../src/server/controllers/game";
import {expect} from "@jest/globals";
import {createPlayer, getMockGame, getMockPlayer} from "./helpers/game";
import Game from "../src/server/models/game";
import gameController from '../src/server/controllers/game';
import {GAME_SOCKET_EVENT} from "../src/utils/constants";

const createSocket = () => {
    return {
        leave: jest.fn(),
        join: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),
        broadcast: {
            emit: jest.fn()
        },
        removeAllListeners: jest.fn(),
        removeListener: jest.fn(),
    };
};

describe('server - game - controllers', () => {
    let server;

    const expectConnect = (game, socket, host) => {
        expect(server.to).toHaveBeenCalledTimes(1);
        expect(server.to).toHaveBeenCalledWith(game.id);
        // expect(server.toEmit.emit).toHaveBeenCalledWith(GAME_SOCKET_EVENT.CONNECT, game, host);
        expect(socket.on).toHaveBeenCalledTimes(5);
        expect(socket.join).toHaveBeenCalledTimes(1);
        expect(socket.join).toHaveBeenCalledWith(game.id);
        // expect(host.game).toBeTruthy();
    };
    
    beforeEach(() => {
        const toEmit = { emit: jest.fn() };

        server = { toEmit, on: jest.fn(), emit: jest.fn(), to: jest.fn(() => toEmit)};

        Game.GAME_LIST = [];
    });

    it('create', () => {
        const socket = createSocket();
        const host = createPlayer(socket);
        
        gameController.create(server, socket, host.id);
        expect(server.emit).toHaveBeenCalledTimes(1);
        expect(server.emit).toHaveBeenCalledWith(GAME_SOCKET_EVENT.CREATE, Game.GAME_LIST[0]);
        expectConnect(Game.GAME_LIST[0], socket, host);
    });
    it('connect', () => {
        const socket = createSocket();
        const host = createPlayer(socket);
        const game = Game.create(host);

        gameController.connect(server, socket, game.id, host.id);
        expectConnect(game, socket, host);
    });

    it('getAll controller', () => {
        const res = { sendJSON: jest.fn() };

        game.getAll({}, res);
        expect(res.sendJSON).toHaveBeenCalledWith([]);
        expect(res.sendJSON.mock.calls).toHaveLength(1);
    });
});