import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import appStore from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {
    finishGame,
    lockLines,
    resetGame,
    setCurrentTetramino,
    setGameProps,
    setIsSinglePlayerGame,
    startGame,
    updateOpponentField
} from "../store/slices/game";
import {selectGameId} from "../store/selectors/game";
import {resetIsWinner, setIsWinner} from "../store/slices/player";

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

    create: (singlePlayer = true, store = appStore) => {
        if (singlePlayer) {
            store.dispatch(setIsSinglePlayerGame());
            store.dispatch(startGame());
            return;
        }

        socket.emit(GAME_SOCKET_EVENT.CREATE, sessionStorageService.getSessionId());
        socket.on(GAME_SOCKET_EVENT.CREATE, GameModel.onCreate);
    },

    connect: (id) => {
        GameModel.clear();

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

    clear: (store = appStore) => {
        store.dispatch(resetGame());
        socket.removeAllListeners();
    },

    kick: (playerId) => {
        GameModel.emit(GAME_SOCKET_EVENT.KICK, playerId);
    },

    leave: () => {
        GameModel.emit(GAME_SOCKET_EVENT.LEAVE);
        GameModel.clear();
    },

    onCreate: (game, store = appStore) => {
        if (game.host.id !== sessionStorageService.getSessionId()) {
            return;
        }
        store.dispatch(setGameProps(game));
        GameModel.connect();
        socket.removeListener(GAME_SOCKET_EVENT.CREATE, GameModel.onCreate);
    },

    onConnect: (game, store = appStore) => {
        store.dispatch(setGameProps(game));
    },

    onStart: (game, store = appStore) => {
        const gameId = selectGameId(store.getState());

        if (game.id === gameId) {
            store.dispatch(resetIsWinner());
            store.dispatch(startGame());
        }
    },

    onUpdate: (data, store = appStore) => {
        const { collapsedLines } = data;

        store.dispatch(updateOpponentField(data));

        if (collapsedLines !== 0) {
            store.dispatch(lockLines(collapsedLines));
        }
    },

    onFinish(game, loser, store = appStore) {
        const gameId = selectGameId(store.getState());

        if (game.id !== gameId) {
            return;
        }
        store.dispatch(finishGame());

        if (loser?.id !== sessionStorageService.getSessionId()) {
            store.dispatch(setIsWinner());
        }
    },

    onKick: (game, playerId, store = appStore) => {
        if (playerId === sessionStorageService.getSessionId()) {
            GameModel.clear();
        } else {
            store.dispatch(setGameProps(game));
        }
    },

    onLeave: (game, playerId, store = appStore) => {
        store.dispatch(setGameProps(game));
    },

    onGenerateTetramino: (tetramino, store = appStore) => {
        store.dispatch(setCurrentTetramino(tetramino));
    }
};

export default GameModel;