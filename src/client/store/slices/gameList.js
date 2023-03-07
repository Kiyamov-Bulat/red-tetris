import {createSlice} from "@reduxjs/toolkit";
import GameListModel from "../../models/gameList";
import {GAME_MODE} from "../../../utils/constants";

const gameListState = {
    state: [],
    mode: GAME_MODE.COMMON,
};

const gameList = createSlice({
    name: "gameList",
    initialState: gameListState,
    reducers: {
        addGame: (state, { payload }) => {
            state.state = [...state.state, payload];
        },
        removeGame: (state, { payload }) => {
            state.state = state.state.filter((game) => game.id !== payload.id);
        },
        setMode(state, { payload }) {
            state.mode = payload;
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
    setMode,
} = gameList.actions;

export const getGameListInitialState = gameList.getInitialState;

export default gameList.reducer;