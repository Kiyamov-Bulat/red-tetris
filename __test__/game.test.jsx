import React from "react";
import Tetramino from "../src/server/models/tetramino";
import {TETRAMINO_TYPE} from "../src/utils/constants";
import GameModel from "../src/client/models/game";
import gameController from '../src/server/controllers/game';
import {renderWithProviders} from "./helpers/redux";
import App from "../src/client/containers/app";
import {fireEvent} from "@testing-library/react";
import {
    selectCurrentTetramino,
    selectGameIsOver,
    selectGameIsStarted,
    selectIsSinglePlayer
} from "../src/client/store/selectors/game";

const createClient = () => {
};

describe('game full imitation', () => {
    it('singlePlayer', () => {
        const { getByText, store } = renderWithProviders(<App/>);
        const btn = getByText('Одиночная');
        
        fireEvent.click(btn);

        const state = store.getState();

        expect(selectIsSinglePlayer(state)).toBeTruthy();
        expect(selectGameIsStarted(state)).toBeTruthy();
        expect(selectGameIsOver(state)).toBeFalsy();
        expect(getByText('С противником')).toBeInTheDocument();

        expect(selectCurrentTetramino(state)).not.toBeNull();
    });

    it.skip('multiPlayer', () => {
        Tetramino._setGeneratorType(TETRAMINO_TYPE.I);
        const toEmit = { emit: jest.fn() };
        const server = { on: jest.fn(), emit: jest.fn(), to: jest.fn(() => toEmit)};
        const clients = [];

        gameController.kick();
    });
});