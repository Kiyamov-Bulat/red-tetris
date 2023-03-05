import Field from "../src/server/models/field";
import {CUBE_TYPE, TETRAMINO_TYPE} from "../src/utils/constants";
import TetraminoModel from "../src/client/models/tetramino";
import FieldModel from "../src/client/models/field";
import Player from "../src/server/models/player";
import Tetramino from "../src/server/models/tetramino";
import Game from "../src/server/models/game";
import {createGame, createPlayer} from "./helpers/game";

describe('server - models', () => {
    it('field', () => {
        const field = FieldModel.getEmpty();
        const transformedField = Field.transformToSpectatorField(field);
        let emptyField = transformedField.every((line) => line.every((column) => column.type === CUBE_TYPE.EMPTY));
        expect(emptyField).toBeTruthy();
        
        const [fieldWithITetramino] = FieldModel.update(field, TetraminoModel.generate(TETRAMINO_TYPE.I));
        const fieldWithTopmostTetramino = Field.transformToSpectatorField(fieldWithITetramino);
        const topLine = fieldWithTopmostTetramino[0];
        const center = 4;
        const topFilledCube = topLine[center]; // default tetramino pos - center;
        
        topLine.splice(center, 1);

        const restCubesIsEmpty = topLine.every((cube) => cube.type === CUBE_TYPE.EMPTY);

        emptyField = fieldWithTopmostTetramino.slice(1)
            .every((line) => line.every((column) => column.type === CUBE_TYPE.EMPTY));
        expect(topFilledCube.type).toBe(CUBE_TYPE.TOPMOST);
        expect(restCubesIsEmpty).toBeTruthy();
        expect(emptyField).toBeTruthy();
    });
    
    describe('game', () => {
        beforeEach(() => {
            Game.GAME_LIST = [];
        });

        const expectGamesN = (n, game) => {
            expect(Game.getAll().length).toBe(n);
            expect(Game.GAME_LIST[n - 1].toJSON()).toEqual(game.toJSON());
            expect(Game.GAME_LIST.length).toBe(n);
        };
        
        it('create', () => {
            const game1 = createGame();
            const game1JSON = {
                players: [],
                isOver: false,
                isStarted: false,
            };

            expect(game1.id).toBeTruthy();
            expect(game1.createdAt).toBeTruthy();
            expect(game1.host).toBeTruthy();

            game1JSON.createdAt = game1.createdAt;
            game1JSON.id = game1.id;
            game1JSON.host = game1.host.toJSON(),

            expect(game1.isOver).toBeFalsy();
            expect(game1.isStarted).toBeFalsy();
            expect(game1.players.length).toBe(0);
            expect(game1.toJSON()).toEqual(game1JSON);
        });

        it('getAll', () => {
            for (let i = 1; i < 11; ++i) {
                const game = createGame();

                expectGamesN(i, game);
            }
        });
        
        it('remove', () => {
            let game;
            
            for (let i = 0; i < 10; ++i) {
                game = createGame();
            }

            expectGamesN(10, game);
            Game.remove(game);
            game = Game.GAME_LIST[Game.GAME_LIST.length - 1];
            expectGamesN(9, game);

            expect(Game.get(game.id).toJSON()).toEqual(game.toJSON());
            Game.remove(game);
            game = Game.GAME_LIST[Game.GAME_LIST.length - 1];
            expectGamesN(8, game);
        });
        
        it('connect - disconnect', () => {
            const game = createGame();
            const host = game.host;
            const players = [];
            const connect = (p, n) => {
                game.connect(p);
                expect(game.players).toHaveLength(n);
                expect(game.host.id).toBe(host.id);
                expect(p.socket.leave.mock.calls).toHaveLength(0);
                expect(p.socket.join.mock.calls).toHaveLength(1);
            };
            const disconnect = (p, n, hostCheck = true) => {
                game.disconnect(p);
                expect(game.players).toHaveLength(n);
                hostCheck && expect(game.isHost(host)).toBeTruthy();
                expect(p.socket.leave.mock.calls).toHaveLength(1);
                expect(p.socket.join.mock.calls).toHaveLength(1);
            };
            connect(host, 1);

            for (let i = 2; i < 11; ++i) {
                const p = createPlayer();

                players.push(p);
                connect(p, i);
            }
            for (let i = 9; i > 1; --i) {
                disconnect(players.pop(), i);
            }
            expect(game.players).toHaveLength(2);
            const newP = createPlayer();

            connect(newP, 3);

            // host disconnect
            disconnect(host, 2, false);
            expect(game.host.id).toBeTruthy();
            expect(game.host.id).not.toBe(host.id);
        });

        it('game imitation', () => {
            const game = createGame();
            const host = game.host;
            const p1 = createPlayer();
            const p2 = createPlayer();
            const expectTetraminos = (n, tetr, playerId) => {
                expect(game._tetraminoQueue[n].players[playerId]).toBeTruthy();
                expect(game._tetraminoQueue[n].value).toEqual(tetr);
            };

            game.connect(host);
            game.connect(p1);
            game.connect(p2);

            const firstTetramino = game.start();

            expect(game.isStarted).toBeTruthy();
            expect(game.isOver).toBeFalsy();
            expect(game._tetraminoQueue).toHaveLength(0);

            // queue: [ value..., { players:  host: false, p1: true, p2: false };
            const nextTetramino1 = game.getNextTetramino(p1.id);
            expect(game._tetraminoQueue).toHaveLength(1);

            expectTetraminos(0, nextTetramino1, p1.id);
            const queue1Players = game._tetraminoQueue[0].players;

            expect(queue1Players[host.id]).toBeFalsy();
            expect(queue1Players[p2.id]).toBeFalsy();

            // queue: [ { value: nextTetramino1, { players:  host: false, p1: true, p2: true } } ];
            expect(game.getNextTetramino(p2.id)).toEqual(nextTetramino1);

            expectTetraminos(0, nextTetramino1, p2.id);

            expect(queue1Players[host.id]).toBeFalsy();
            expect(queue1Players[p1.id]).toBeTruthy();

            // queue: [
            // { value: nextTetramino1, { players:  host: false, p1: true, p2: true } }
            // { value: nextTetramino2, { players:  host: false, p1: false, p2: true } }
            // ];
            const nextTetramino2 =  game.getNextTetramino(p2.id);
            const queue2Players = game._tetraminoQueue[1].players;

            expectTetraminos(1, nextTetramino2, p2.id);
            expect(queue2Players[host.id]).toBeFalsy();
            expect(queue2Players[p1.id]).toBeFalsy();
            expect(game._tetraminoQueue).toHaveLength(2);

            // queue: [
            // { value: nextTetramino2, { players:  host: false, p1: true, p2: false } }
            // ];
            expect(game.getNextTetramino(host.id)).toEqual(nextTetramino1);
            expect(queue2Players[host.id]).toBeFalsy();
            expect(queue2Players[p1.id]).toBeFalsy();
            expect(game._tetraminoQueue).toHaveLength(1);

            // queue: [
            // { value: nextTetramino2, { players:  host: true, p1: false, p2: true } }
            // ];
            expect(game.getNextTetramino(host.id)).toEqual(nextTetramino2);
            expect(game._tetraminoQueue).toHaveLength(1);
            expectTetraminos(0, nextTetramino2, host.id);

            expect(game.getNextTetramino(p1.id)).toEqual(nextTetramino2);
            // queue: [];
            expect(game._tetraminoQueue).toHaveLength(0);

            game.finish();

            expect(game.isOver).toBeTruthy();
            expect(game.isStarted).toBeFalsy();
            game.destroy();

            expect(game.isOver).toBeFalsy();
            expect(game.isStarted).toBeFalsy();
            expect(game.host).toBeNull();
            expect(game.createdAt).toBeNull();
            expect(game.players).toHaveLength(0);
            expect(game._tetraminoQueue).toHaveLength(0);
            expect(Game.GAME_LIST).toHaveLength(0);
        });
    });
    
    it('player', () => {
        const player = new Player(1, { id: 'socket-id'});

        expect(player.id).toBe(1);
        expect(player.name).toBe(Player.DEFAULT_NAME);
        expect(player.socket).toBeTruthy();
        expect(player.socket.id).toBe('socket-id');
        expect(player.game).toBeUndefined();
        expect(player.toJSON()).toEqual({ id: 1, name: Player.DEFAULT_NAME });
        player.game = { id: 'game-id' };
        expect(player.game).toEqual({ id: 'game-id' });
    });
    
    it('tetramino', () => {
        const tetramino = Tetramino.generate();
        const pos = { column: 4, line: 0 };
        const cubes = tetramino.getCubes();
        const topmost = tetramino.getTopmostCube();

        expect(cubes.length).toBe(4);
        expect(topmost.line).toBe(pos.line);

        const someCubeOnCenter = cubes.some((cube) => cube.line === pos.line && cube.column === pos.column);

        expect(someCubeOnCenter).toBeTruthy();
    });
});