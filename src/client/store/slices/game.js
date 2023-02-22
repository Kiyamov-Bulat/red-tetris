import {createSlice} from "@reduxjs/toolkit";
import TetraminoModel from "../../models/tetramino";
import {FIELD_SIZE} from "../../utils/constants";

const gameState = {
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

            if (state.currentTetramino.position.line === FIELD_SIZE.line) {
                state.currentTetramino = null;
                return;
            }
            state.currentTetramino = TetraminoModel.incrementLine(state.currentTetramino);
        },
        rotateTetramino(state) {
            state.currentTetramino = TetraminoModel.rotate(state.currentTetramino);
        },

        moveLeftTetramino(state) {
            state.currentTetramino = TetraminoModel.moveLeft(state.currentTetramino);
        },

        moveRightTetramino(state) {
            state.currentTetramino = TetraminoModel.moveRight(state.currentTetramino);
        },

        moveBottomTetramino(state) {
            state.currentTetramino = TetraminoModel.incrementLine(state.currentTetramino);
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