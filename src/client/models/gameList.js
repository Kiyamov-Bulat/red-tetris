import {createAsyncThunk} from "@reduxjs/toolkit";
import jsonFetch from "../services/fetch";
import GameModel from "./game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {addGame, removeGame} from "../store/slices/gameList";
import store from "../store";

const GameListModel = {
    get: createAsyncThunk('gameList/get', (_, thunkAPI) => {
        return jsonFetch('/list', 'GET', { throwErr: true })
            .then((state) => thunkAPI.fulfillWithValue(state))
            .catch(() => thunkAPI.rejectWithValue([]));
    }),

    _addGame: (game) => {
        store.dispatch(addGame(game));
    },

    _removeGame: (game) => {
        store.dispatch(removeGame(game));
    },

    listenUpdates: () => {
        GameModel.get().on(GAME_SOCKET_EVENT.CREATE, GameListModel._addGame);
        GameModel.get().on(GAME_SOCKET_EVENT.DESTROY, GameListModel._removeGame);
    },

    removeUpdatesListener: () => {
        GameModel.get().removeListener(GAME_SOCKET_EVENT.CREATE, GameListModel._addGame);
    },
};

export default GameListModel;