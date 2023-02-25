import {createSlice} from "@reduxjs/toolkit";
import GameList from "../../models/gameList";

const gameListState = {
    state: []
};

const gameList = createSlice({
    name: "gameList",
    initialState: gameListState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(GameList.get.fulfilled, (state, { payload }) => {
                state.state = payload;
            })
            .addCase(GameList.get.rejected, (state, { payload }) => {
                state.state = payload;
            });
    }
});

export default gameList.reducer;