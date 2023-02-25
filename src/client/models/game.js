import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import {selectGameId} from "../store/selectors/game";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import jsonFetch from "../services/fetch";
import {createAsyncThunk} from "@reduxjs/toolkit";

const socket = io();

const Game = {
    get: () => {
        return socket.to(selectGameId(store.getState()));
    },

    emit: (event, ...args) => {
        Game.get().emit(event, ...args);
    },

    create: createAsyncThunk('game/create', (_, thunkAPI) => {
        return jsonFetch('/create', 'POST',
            { body: { hostId: sessionStorageService.getSessionId() }
        })
            .then((game) => thunkAPI.fulfillWithValue(game))
            .catch(() => thunkAPI.rejectWithValue(null));
    }),

    connect: () => {
        const game = Game.get();

        game.emit(
            GAME_SOCKET_EVENT.CONNECT,
            sessionStorageService.getSessionId()
        );

        game.on(GAME_SOCKET_EVENT.START, () => {

        });

        game.on(GAME_SOCKET_EVENT.UPDATE, () => {

        });

        game.on(GAME_SOCKET_EVENT.FINISH, () => {
            
        });

        game.on(GAME_SOCKET_EVENT.RESTART, () => {
            
        });
    },
    
    update: () => {
        Game.emit(GAME_SOCKET_EVENT.UPDATE);
    },

    restart: () => {
        Game.emit(GAME_SOCKET_EVENT.RESTART);
    },

    finish: () => {
        Game.emit(GAME_SOCKET_EVENT.FINISH);
    },

    clear() {
       socket.removeAllListeners();
    },
};

export default Game;