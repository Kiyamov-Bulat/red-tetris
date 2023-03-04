import {createSlice} from "@reduxjs/toolkit";
import GameListModel from "../../models/gameList";

const gameListState = {
    state: []
};

const gameList = createSlice({
    name: "gameList",
    initialState: gameListState,
    reducers: {
        addGame: (state, { payload }) => {
            state.state.push(payload);
        },
        removeGame: (state, { payload }) => {
            state.state = state.state.filter((game) => game.id !== payload.id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GameListModel.get.fulfilled, (state, { payload }) => {
                state.state = payload;
            })
            .addCase(GameListModel.get.rejected, (state, { payload }) => {
                state.state = payload || [];
            });
    }
});

export const {
    addGame,
    removeGame,
} = gameList.actions;

export const getGameListInitialState = gameList.getInitialState;

export default gameList.reducer;