import {createSlice, current} from "@reduxjs/toolkit";
import TetraminoModel from "../../models/tetramino";
import FieldModel from "../../models/field";
import {CUBE_TYPE} from "../../../utils/constants";
import sessionStorageService from "../../services/sessionStorageService";

const gameState = {
    id: '',
    host: null,
    createdAt: new Date().toISOString(),
    players: [],

    opponentsFields: [],
    field: FieldModel.getEmpty(),
    currentTetramino: null, //{ type: TETRAMINO_TYPE.I },

    isSinglePlayer: true,
    isStarted: false,
    isOver: false,
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
                .map((player) => (
                    { playerId: player.id, field: FieldModel.getEmpty() }
                ));
        },

        setGameProps(state, { payload: game }) {
            state.id = game.id;
            state.createdAt = game.createdAt;
            state.host = game.host;
            state.players = game.players;
        },

        updateOpponentField(state, { payload }) {
            const fieldIdx = state.opponentsFields.findIndex(({ playerId }) =>
                playerId === payload.player.id
            );

            if (fieldIdx !== -1) {
                state.opponentsFields[fieldIdx] = payload.field;
            }
        },

        setIsSinglePlayerGame(state) {
            state.isSinglePlayer = true;
        },

        generateTetramino(state) {

        },
        updateGameState(state) {
            if (!state.currentTetramino) {
                state.currentTetramino = TetraminoModel.generate();
                return;
            }

            if (FieldModel.atBottom(state.field, state.currentTetramino)) {
                state.field = FieldModel.update(state.field, state.currentTetramino);
                state.currentTetramino = null;

                if (state.field[0].some((column) => column.type !== CUBE_TYPE.EMPTY)) {
                    state.isOver = true;
                    state.isStarted = false;
                    state.field = FieldModel.getEmpty();
                }
                return;
            }
            state.currentTetramino = TetraminoModel.incrementLine(state.currentTetramino);
        },
        rotateTetramino(state) {
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
        }
    },
});

export const {
    startGame,
    setGameProps,
    setIsSinglePlayerGame,
    updateGameState,
    updateOpponentField,
    rotateTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveBottomTetramino,
    moveToPile,
} = game.actions;

export default game.reducer;