import {createSlice} from "@reduxjs/toolkit";
import TetraminoModel, {CUBE_TYPE} from "../../models/tetramino";
import FieldModel, {FIELD} from "../../models/field";
import Game from "../../models/game";

const gameState = {
    id: '',
    host: null,
    createdAt: new Date().toISOString(),
    oppositeFields: [],
    field: [...FIELD],
    currentTetramino: null, //{ type: TETRAMINO_TYPE.I },
    isSinglePlay: true,
    isOver: false,
};

const game = createSlice({
    name: "game",
    initialState: gameState,
    reducers: {
        startGame(state) {
            state.isOver = false;
            state.field = [...FIELD ];
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
    extraReducers: (builder) => {
        builder
            .addCase(Game.create.fulfilled, (state, { payload }) => {
                state.id = payload.id;
                state.createdAt = payload.createdAt;
                state.host = payload.host;
            })
            .addCase(Game.create.rejected, (state) => {
                //@TODO
            });
    }
});

export const {
    startGame,
    updateGameState,
    rotateTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveBottomTetramino,
    moveToPile,
} = game.actions;

export default game.reducer;