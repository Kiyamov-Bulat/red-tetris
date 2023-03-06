import {createSlice} from "@reduxjs/toolkit";
import {v4 as uuidv4} from 'uuid';
import {SCORE_COLLAPSE_UNIT, SCORE_UNIT} from "../../../utils/constants";

const playerState = {
    id: uuidv4(),
    name: '',
    isWinner: false,
    score: 0,
};


const player = createSlice({
    name: "player",
    initialState: playerState,
    reducers: {
        setName(state, { payload }) {
            state.name = payload;
        },
        setIsWinner(state) {
            state.isWinner = true;
        },
        setScore(state, { payload: score }) {
            state.score = score;
        },
        resetScore(state) {
            state.score = 0;
        },
        resetIsWinner(state) {
            state.isWinner = false;
        },

        updateScore(state, { payload: collapsedLines }) {
            if (collapsedLines) {
                state.score += SCORE_COLLAPSE_UNIT * collapsedLines;
            } else {
                state.score += SCORE_UNIT;
            }
        }
    }
});

export const {
    setName,
    setIsWinner,
    setScore,
    updateScore,
    resetScore,
    resetIsWinner,
} = player.actions;


export const getPlayerInitialState = player.getInitialState;

export default player.reducer;