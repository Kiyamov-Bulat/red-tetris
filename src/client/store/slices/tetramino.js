import TetraminoModel from "../../models/tetramino";
import FieldModel from "../../models/field";
import {createSlice} from "@reduxjs/toolkit";

const tetraminoState = {
    currentTetramino: null,
};


const tetramino = createSlice({
    name: "tetramino",
    initialState: tetraminoState,
    reducers: {
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
    }
});

export const {
    setName
} = tetramino.actions;

export default tetramino.reducer;
