import {createAsyncThunk} from "@reduxjs/toolkit";
import jsonFetch from "../services/fetch";
import Game from "./game";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {addGame} from "../store/slices/gameList";
import store from "../store";

const GameList = {
    get: createAsyncThunk('gameList/get', (_, thunkAPI) => {
        return jsonFetch('/list', 'GET', { throwErr: true })
            .then((state) => thunkAPI.fulfillWithValue(state))
            .catch(() => thunkAPI.rejectWithValue([]));
    }),

    _addGame: (game) => {
        store.dispatch(addGame(game));
    },

    listenUpdates: () => {
       Game.get().on(GAME_SOCKET_EVENT.CREATE, GameList._addGame);
    },

    removeUpdatesListener: () => {
        Game.get().removeListener(GAME_SOCKET_EVENT.CREATE, GameList._addGame);
    },
};

export default GameList;