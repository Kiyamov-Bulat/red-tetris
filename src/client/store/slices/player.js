import {createSlice} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const playerState = {
    id: uuidv4(),
    name: '',
    isWinner: false,
};


const player = createSlice({
    name: "player",
    initialState: playerState,
    reducers: {
        setName(state, { payload }) {
            state.name = payload;
        }
    }
});

export const {
    setName
} = player.actions;

export default player.reducer;