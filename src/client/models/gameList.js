import {createAsyncThunk} from "@reduxjs/toolkit";
import jsonFetch from "../services/fetch";

const GameList = {
    get: createAsyncThunk('gameList/get', (_, thunkAPI) => {
        return jsonFetch('/list', 'GET', { throwErr: true })
            .then((state) => thunkAPI.fulfillWithValue(state))
            .catch(() => thunkAPI.rejectWithValue([]));
    })
};

export default GameList;