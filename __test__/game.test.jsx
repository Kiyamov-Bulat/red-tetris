import React from "react";
import Tetramino from "../src/server/models/tetramino";
import {CUBE_TYPE, FIELD_SIZE, INITIAL_TETRAMINO_POSITION, TETRAMINO_TYPE} from "../src/utils/constants";
import gameController from '../src/server/controllers/game';
import {renderWithProviders} from "./helpers/redux";
import App from "../src/client/containers/app";
import {act, fireEvent, waitFor} from "@testing-library/react";
import {
    selectCurrentTetramino, selectField,
    selectGameIsOver,
    selectGameIsStarted,
    selectIsSinglePlayer
} from "../src/client/store/selectors/game";
import {GAME_UPDATE_TIMEOUT} from "../src/client/containers/game/useGameUpdate";
import TetraminoModel from "../src/client/models/tetramino";
import {updateGameState} from "../src/client/store/slices/game";

const createClient = () => {
};

const ARROW_DOWN = {
    key: "ArrowDown",
    keyCode: 40
};

const ARROW_RIGHT = {
    key: "ArrowRight",
    keyCode: 39
};

const ARROW_UP = {
    key: "ArrowUp",
    keyCode: 38
};

const ARROW_LEFT = {
    key: "ArrowLeft",
    keyCode: 37
};

const SPACE = {
    key: " ",
    keyCode: 32
};

describe('game full imitation', () => {
    it('singlePlayer', async () => {
        window.setInterval = () => 1;

        const { getByText, store } = renderWithProviders(<App/>);
        const btn = getByText('Одиночная');

        TetraminoModel.setGenerateType(TETRAMINO_TYPE.I);

        fireEvent.click(btn);

        const state = store.getState();

        expect(selectIsSinglePlayer(state)).toBeTruthy();
        expect(selectGameIsStarted(state)).toBeTruthy();
        expect(selectGameIsOver(state)).toBeFalsy();
        expect(getByText('С противником')).toBeInTheDocument();

        act(() => store.dispatch(updateGameState()));
        expect(selectCurrentTetramino(store.getState())).not.toBeNull();

        fireEvent.keyDown(document, ARROW_DOWN);

        let currentTetramino = selectCurrentTetramino(store.getState());
        const lowestCube = TetraminoModel.getLowestCube(currentTetramino);

        expect(lowestCube).toEqual({ line: FIELD_SIZE.line - 1, column: INITIAL_TETRAMINO_POSITION.column });

        act(() => store.dispatch(updateGameState())); // 19

        let field = selectField(store.getState());

        for (const cube of TetraminoModel.getCubes(currentTetramino)) {
            expect(field[cube.line][cube.column].type).toBe(currentTetramino.type);
        }

        act(() => store.dispatch(updateGameState())); // 0

        currentTetramino = selectCurrentTetramino(store.getState());

        expect(TetraminoModel.getTopmostCube(currentTetramino)).toEqual({...INITIAL_TETRAMINO_POSITION});

        fireEvent.keyDown(document, ARROW_LEFT);

        currentTetramino = selectCurrentTetramino(store.getState());

        expect(TetraminoModel.getTopmostCube(currentTetramino)).toEqual({
            ...INITIAL_TETRAMINO_POSITION, column: INITIAL_TETRAMINO_POSITION.column - 1
        });
        fireEvent.keyDown(document, ARROW_RIGHT);
        fireEvent.keyDown(document, ARROW_RIGHT);

        currentTetramino = selectCurrentTetramino(store.getState());

        expect(TetraminoModel.getTopmostCube(currentTetramino)).toEqual({
            ...INITIAL_TETRAMINO_POSITION, column: INITIAL_TETRAMINO_POSITION.column + 1
        });

        act(() => store.dispatch(updateGameState())); // 1
        
        fireEvent.keyDown(document, ARROW_UP);

        currentTetramino = selectCurrentTetramino(store.getState());

        // current line (1) + 2
        const onOneLine = TetraminoModel.getCubes(currentTetramino).every((cube) => cube.line === 3);

        expect(onOneLine).toBeTruthy();
        fireEvent.keyDown(document, SPACE);
        currentTetramino = selectCurrentTetramino(store.getState());
        expect(TetraminoModel.getTopmostCube(currentTetramino).line).toEqual(4);
        expect(TetraminoModel.getLeftmostCube(currentTetramino).column).toEqual(INITIAL_TETRAMINO_POSITION.column);

        act(() => store.dispatch(updateGameState())); // 5
        fireEvent.keyDown(document, ARROW_RIGHT);
        fireEvent.keyDown(document, ARROW_DOWN);
        act(() => store.dispatch(updateGameState())); // 19
        act(() => store.dispatch(updateGameState())); // 0

        for (let i = 5; i < FIELD_SIZE.column; ++i) {
            fireEvent.keyDown(document, ARROW_RIGHT);
        }
        fireEvent.keyDown(document, ARROW_DOWN);

        act(() => store.dispatch(updateGameState()));
        act(() => store.dispatch(updateGameState()));

        for (let i = 4; i >= 0; --i) {
            fireEvent.keyDown(document, ARROW_LEFT);
        }
        fireEvent.keyDown(document, ARROW_UP);
        fireEvent.keyDown(document, ARROW_DOWN);

        act(() => store.dispatch(updateGameState()));
        const everyFilled = selectField(store.getState())[FIELD_SIZE.line - 1].every((cube) => cube.type !== CUBE_TYPE.EMPTY);
        expect(everyFilled).toBeFalsy();

        act(() => store.dispatch(updateGameState()));

        for (let i = 0; i < 5; ++i) {
            fireEvent.keyDown(document, ARROW_DOWN);

            act(() => store.dispatch(updateGameState()));
            act(() => store.dispatch(updateGameState()));
        }
        expect(selectGameIsOver(store.getState())).toBeTruthy();
        expect(selectGameIsStarted(store.getState())).toBeFalsy();

        TetraminoModel.setGenerateType(null);
    });

    it.skip('multiPlayer', () => {
        Tetramino._setGeneratorType(TETRAMINO_TYPE.I);
        const toEmit = { emit: jest.fn() };
        const server = { on: jest.fn(), emit: jest.fn(), to: jest.fn(() => toEmit)};
        const clients = [];

        gameController.kick();
    });
});