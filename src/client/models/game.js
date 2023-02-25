import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import {selectGameId} from "../store/selectors/game";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import jsonFetch from "../services/fetch";
import {createAsyncThunk} from "@reduxjs/toolkit";

const socket = io();

const Game = {
    get: (id = selectGameId(store.getState())) => {
        return socket.to(id);
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

    connect: (id) => {
        const game = Game.get(id);

        game.emit(
            GAME_SOCKET_EVENT.CONNECT,
            sessionStorageService.getSessionId()
        );
        
        game.on(GAME_SOCKET_EVENT.START, Game.onStart);
        game.on(GAME_SOCKET_EVENT.UPDATE, Game.onUpdate);
        game.on(GAME_SOCKET_EVENT.FINISH, Game.onFinish);
        game.on(GAME_SOCKET_EVENT.RESTART, Game.onRestart);
        game.on(GAME_SOCKET_EVENT.KICK, Game.onKick);
        game.on(GAME_SOCKET_EVENT.JOIN, Game.onJoin);
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

    onStart: () => {

    },

    onUpdate: () => {
    },

    onRestart: () => {
    },

    onFinish() {

    },

    onJoin: () => {

    },

    onKick: () => {
        Game.clear();
    },
};

export default Game;