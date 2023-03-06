import {createSlice} from "@reduxjs/toolkit";
import TetraminoModel from "../../models/tetramino";
import FieldModel from "../../models/field";
import sessionStorageService from "../../services/sessionStorageService";
import {GAME_MODE} from "../../../utils/constants";

export const gameState = {
    id: '',
    host: null,
    createdAt: new Date().toISOString(),
    players: [],

    opponentsFields: [],
    field: FieldModel?.getEmpty(),
    currentTetramino: null, //{ type: TETRAMINO_TYPE.I },

    isSinglePlayer: false,
    isStarted: false,
    isOver: false,

    mode: GAME_MODE.COMMON,
};

const game = createSlice({
    name: "game",
    initialState: gameState,
    reducers: {
        startGame(state) {
            state.isStarted = true;
            state.isOver = false;
            state.field = FieldModel.getEmpty();
            state.opponentsFields = state.players
                .filter((player) => player.id !== sessionStorageService.getSessionId())
                .map((player) => ({ player, field: FieldModel.getEmpty() }));
        },

        finishGame(state) {
            state.isStarted = false;
            state.isOver = true;
            state.field = FieldModel.getEmpty();
            state.opponentsFields = [];
            state.currentTetramino = null;
        },

        resetGame() {
            return gameState;
        },

        setGameProps(state, { payload: game }) {
            state.id = game.id;
            state.createdAt = game.createdAt;
            state.host = game.host;
            state.players = game.players;
        },

        updateOpponentField(state, { payload }) {
            const fieldIdx = state.opponentsFields.findIndex(({ player }) =>
                player.id === payload.player.id
            );
            const playerIdx = state.players.findIndex((next) => next.id === payload.player.id);

            // @TODO
            if (playerIdx !== -1) {
                state.players[playerIdx] = payload.player;
            }

            if (fieldIdx !== -1) {
                state.opponentsFields[fieldIdx] = { field: payload.field, player: payload.player };
            }
        },

        setIsSinglePlayerGame(state) {
            state.isSinglePlayer = true;
        },

        setCurrentTetramino(state, { payload }) {
            state.currentTetramino = payload;
        },

        updateGameState(state, { payload }) {
            state.field = payload;
            state.currentTetramino = null;
        },

        generateTetramino(state) {
            state.currentTetramino = TetraminoModel.generate();
        },

        lockLines(state, { payload }) {
            state.field = FieldModel.lockNLines(state.field, payload);
        },

        rotateTetramino(state) {
            if (!state.currentTetramino) {
                return;
            }

            let rotatedTetramino = TetraminoModel.rotate(state.currentTetramino);

            while (TetraminoModel.outsideLeftEdge(rotatedTetramino)) {
               rotatedTetramino = TetraminoModel.moveRight(rotatedTetramino);
            }
            while (TetraminoModel.outsideRightEdge(rotatedTetramino)) {
                rotatedTetramino = TetraminoModel.moveLeft(rotatedTetramino);
            }
            if (!TetraminoModel.intersectsPile(state.field, rotatedTetramino)) {
                state.currentTetramino = rotatedTetramino;
            }
        },

        moveLeftTetramino(state) {
            if (!state.currentTetramino || FieldModel.atLeft(state.field, state.currentTetramino)) {
                return;
            }
            state.currentTetramino = TetraminoModel.moveLeft(state.currentTetramino);
        },

        moveRightTetramino(state) {
            if (!state.currentTetramino || FieldModel.atRight(state.field, state.currentTetramino)) {
                return;
            }
            state.currentTetramino = TetraminoModel.moveRight(state.currentTetramino);
        },

        moveBottomTetramino(state) {
            if (!state.currentTetramino || FieldModel.atBottom(state.field, state.currentTetramino)) {
                return;
            }
            state.currentTetramino = TetraminoModel.moveBottom(state.currentTetramino);
        },

        moveToPile(state) {
            if (!state.currentTetramino || FieldModel.atBottom(state.field, state.currentTetramino)) {
                return;
            }
            const pileLine = FieldModel.getPileLine(state.field, state.currentTetramino);

            state.currentTetramino = TetraminoModel.moveToPile(state.currentTetramino, pileLine);
        },

        setMode(state, { payload }) {
            state.mode = payload;
        }
    },

});

export const {
    startGame,
    finishGame,
    resetGame,
    setGameProps,
    setIsSinglePlayerGame,
    setCurrentTetramino,
    updateGameState,
    updateOpponentField,
    lockLines,
    rotateTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveBottomTetramino,
    moveToPile,
    generateTetramino,
    setMode,
} = game.actions;

export const getGameInitialState = game.getInitialState;

export default game.reducer;