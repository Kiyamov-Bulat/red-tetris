import {createSlice} from "@reduxjs/toolkit";

const gameState = {};

const game = createSlice({
    name: "game",
    initialState: gameState,
    reducers: {
        generateTetramino() {

        }
    }
});


export default game.reducer;