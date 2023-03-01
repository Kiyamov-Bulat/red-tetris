import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {
    finishGame,
    lockLines, resetGame,
    setCurrentTetramino,
    setGameProps,
    setIsSinglePlayerGame,
    startGame,
    updateOpponentField
} from "../store/slices/game";

export const SIDE_PANEL_TYPE = {
    MAIN: '@side-panel-type/main',
    WAIT_START: '@side-panel-type/wait-start',
    FIELDS: '@side-panel-type/fields',
};

const socket = io();

const GameModel = {
    get: () => {
        return socket;
    },

    emit: (event, ...args) => {
        GameModel.get().emit(event, ...args);
    },

    create: (singlePlayer = true) => {
        if (singlePlayer) {
            store.dispatch(setIsSinglePlayerGame());
            store.dispatch(startGame());
            return;
        }
        socket.emit(GAME_SOCKET_EVENT.CREATE, sessionStorageService.getSessionId());
        socket.on(GAME_SOCKET_EVENT.CREATE, GameModel.onCreate);
    },

    connect: (id) => {
        const game = GameModel.get();

        GameModel._listenGameEvents(game);

        if (id) {
            game.emit(
                GAME_SOCKET_EVENT.CONNECT,
                id,
                sessionStorageService.getSessionId()
            );
        }
    },

    _listenGameEvents: (game = GameModel.get()) => {
        game.on(GAME_SOCKET_EVENT.CONNECT, GameModel.onConnect);
        game.on(GAME_SOCKET_EVENT.START, GameModel.onStart);
        game.on(GAME_SOCKET_EVENT.UPDATE, GameModel.onUpdate);
        game.on(GAME_SOCKET_EVENT.FINISH, GameModel.onFinish);
        game.on(GAME_SOCKET_EVENT.KICK, GameModel.onKick);
        game.on(GAME_SOCKET_EVENT.GENERATE_TETRAMINO, GameModel.onGenerateTetramino);
    },

    start: () => {
        GameModel.emit(GAME_SOCKET_EVENT.START);
    },

    update: (field, collapsedLines) => {
        GameModel.emit(GAME_SOCKET_EVENT.UPDATE, field, collapsedLines);
    },

    finish: () => {
        GameModel.emit(GAME_SOCKET_EVENT.FINISH);
    },

    clear: () => {
        store.dispatch(resetGame());
        socket.removeAllListeners();
    },

    kick: (playerId) => {
        GameModel.emit(GAME_SOCKET_EVENT.KICK, playerId);
    },

    onCreate: (game) => {
        if (game.host.id !== sessionStorageService.getSessionId()) {
            return;
        }
        store.dispatch(setGameProps(game));
        GameModel.connect();
        socket.removeListener(GAME_SOCKET_EVENT.CREATE, GameModel.onCreate);
    },

    onConnect: (game) => {
        store.dispatch(setGameProps(game));
    },

    onStart: () => {
        store.dispatch(startGame());
    },

    onUpdate: (data) => {
        const { collapsedLines } = data;

        store.dispatch(updateOpponentField(data));

        if (collapsedLines !== 0) {
            store.dispatch(lockLines(collapsedLines));
        }
    },

    onFinish() {
        store.dispatch(finishGame());
    },

    onKick: (game, playerId) => {
        if (playerId === sessionStorageService.getSessionId()) {
            GameModel.clear();
        } else {
            store.dispatch(setGameProps(game));
        }
    },

    onGenerateTetramino: (tetramino) => {
        store.dispatch(setCurrentTetramino(tetramino));
    }
};

export default GameModel;