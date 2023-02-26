import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import {selectGameId} from "../store/selectors/game";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {createGame, setGameProps, setIsSinglePlayerGame, startGame} from "../store/slices/game";

export const SIDE_PANEL_TYPE = {
    MAIN: '@side-panel-type/main',
    WAIT_START: '@side-panel-type/wait-start',
    FIELDS: '@side-panel-type/fields',
};

const socket = io();

const Game = {
    get: () => {
        return socket;
    },

    emit: (event, ...args) => {
        Game.get().emit(event, ...args);
    },

    create: (singlePlayer = true) => {
        if (singlePlayer) {
            store.dispatch(setIsSinglePlayerGame());
            store.dispatch(startGame());
            return;
        }
        socket.emit(GAME_SOCKET_EVENT.CREATE, sessionStorageService.getSessionId());
        socket.on(GAME_SOCKET_EVENT.CREATE, Game.onCreate);
    },

    connect: (id) => {
        const game = Game.get();

        Game._listenGameEvents(game);

        if (id) {
            console.log('here')
            game.emit(
                GAME_SOCKET_EVENT.CONNECT,
                id,
                sessionStorageService.getSessionId()
            );
        }

    },

    _listenGameEvents: (game = Game.get()) => {
        game.on(GAME_SOCKET_EVENT.CONNECT, Game.onConnect);
        game.on(GAME_SOCKET_EVENT.START, Game.onStart);
        game.on(GAME_SOCKET_EVENT.UPDATE, Game.onUpdate);
        game.on(GAME_SOCKET_EVENT.FINISH, Game.onFinish);
        game.on(GAME_SOCKET_EVENT.RESTART, Game.onRestart);
        game.on(GAME_SOCKET_EVENT.KICK, Game.onKick);
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

    clear: () => {
       socket.removeAllListeners();
    },

    onCreate: (game) => {
        if (game.host.id !== sessionStorageService.getSessionId()) {
            return;
        }
        store.dispatch(setGameProps(game));
        Game.connect();
        socket.removeListener(GAME_SOCKET_EVENT.CREATE, Game.onCreate);
    },

    onConnect: ({ game, player }) => {
        store.dispatch(setGameProps(game));
    },

    onStart: () => {

    },

    onUpdate: () => {
    },

    onRestart: () => {
    },

    onFinish() {

    },

    onKick: () => {
        Game.clear();
    },
};

export default Game;