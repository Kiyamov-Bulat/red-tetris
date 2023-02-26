import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import {selectGameId} from "../store/selectors/game";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import jsonFetch from "../services/fetch";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {createGame} from "../store/slices/game";

export const SIDE_PANEL_TYPE = {
    MAIN: '@side-panel-type/main',
    WAIT_START: '@side-panel-type/wait-start',
    FIELDS: '@side-panel-type/fields',
};

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
            .then((game) => {
                Game._listenGameEvents(game.id);
                thunkAPI.fulfillWithValue(game);
            })
            .catch(() => thunkAPI.rejectWithValue(null));
    }),

    connect: createAsyncThunk('game/connect', (gameId, thunkAPI) => {
        return jsonFetch('/connect', 'POST',
            { body: { gameId,  playerId: sessionStorageService.getSessionId() }
            })
            .then((game) => {
                Game._listenGameEvents(game.id);
                thunkAPI.fulfillWithValue(game);
            })
            .catch(() => thunkAPI.rejectWithValue(null));
    }),

    _listenGameEvents(gameId) {
        const game = Game.get(gameId);

        game.on(GAME_SOCKET_EVENT.CONNECT, Game.onConnect);
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

    onConnect: () => {

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