import {createSlice} from "@reduxjs/toolkit";
import TetraminoModel from "../../models/tetramino";
import FieldModel, {FIELD} from "../../models/field";

const gameState = {
    field: [ ...FIELD ],
    currentTetramino: null, //{ type: TETRAMINO_TYPE.I },
    isSinglePlay: true,
};


const game = createSlice({
    name: "game",
    initialState: gameState,
    reducers: {
        startGame(state) {

        },
        generateTetramino(state) {

        },
        updateGameState(state) {
            if (!state.currentTetramino) {
                state.currentTetramino = TetraminoModel.generate();
                return;
            }

            if (TetraminoModel.atFieldBottom(state.field, state.currentTetramino)) {
                state.field = FieldModel.update(state.field, state.currentTetramino);
                state.currentTetramino = null;
                return;
            }
            state.currentTetramino = TetraminoModel.incrementLine(state.currentTetramino);
        },
        rotateTetramino(state) {
            state.currentTetramino = TetraminoModel.rotate(state.currentTetramino);
        },

        moveLeftTetramino(state) {
            state.currentTetramino = TetraminoModel.moveLeft(state.field, state.currentTetramino);
        },

        moveRightTetramino(state) {
            state.currentTetramino = TetraminoModel.moveRight(state.field, state.currentTetramino);
        },

        moveBottomTetramino(state) {
            state.currentTetramino = TetraminoModel.moveBottom(state.field, state.currentTetramino);
        }
    }
});

export const {
    startGame,
    updateGameState,
    rotateTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveBottomTetramino,
} = game.actions;

export default game.reducer;