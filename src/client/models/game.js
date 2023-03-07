import io from "socket.io-client";
import sessionStorageService from "../services/sessionStorageService";
import store from "../store";
import {GAME_SOCKET_EVENT} from "../../utils/constants";
import {
    finishGame,
    generateTetramino,
    lockLines,
    moveBottomTetramino,
    resetGame,
    setCurrentTetramino,
    setField,
    setGameProps,
    setIsSinglePlayerGame,
    setMode,
    startGame,
    updateGameState,
    updateOpponentField
} from "../store/slices/game";
import {
    selectCurrentTetramino,
    selectField,
    selectGameId,
    selectGameMode,
    selectIsSinglePlayer
} from "../store/selectors/game";
import {resetIsWinner, resetScore, setIsWinner, setScore, updateScore} from "../store/slices/player";
import FieldModel from "./field";
import {setMode as setModeGameList} from '../store/slices/gameList';

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
            store.dispatch(resetScore());
            store.dispatch(setIsSinglePlayerGame());
            store.dispatch(startGame());
            return;
        }

        socket.emit(GAME_SOCKET_EVENT.CREATE, sessionStorageService.getSessionId(), selectGameMode(store.getState()));
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

    clear: () => {
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

    onCreate: (game) => {
        if (game.host.id !== sessionStorageService.getSessionId()) {
            return;
        }

        GameModel.connect();
        store.dispatch(setGameProps(game));
        socket.removeListener(GAME_SOCKET_EVENT.CREATE, GameModel.onCreate);
    },

    onConnect: (game) => {
        store.dispatch(setGameProps(game));
    },

    onStart: (game) => {
        const gameId = selectGameId(store.getState());

        if (game.id === gameId) {
            store.dispatch(resetIsWinner());
            store.dispatch(resetScore());
            store.dispatch(startGame());
        }
    },

    onUpdate: (data) => {
        const { collapsedLines } = data;

        store.dispatch(updateOpponentField(data));

        if (collapsedLines !== 0) {
            store.dispatch(lockLines(collapsedLines));
        }
    },

    onFinish(game, winner) {
        const gameId = selectGameId(store.getState());

        if (game.id !== gameId) {
            return;
        }
        store.dispatch(finishGame());

        if (winner?.id === sessionStorageService.getSessionId()) {
            store.dispatch(setIsWinner());
        }
    },

    onKick: (game, playerId) => {
        if (playerId === sessionStorageService.getSessionId()) {
            GameModel.clear();
        } else {
            store.dispatch(setGameProps(game));
        }
    },

    onLeave: (game, playerId) => {
        store.dispatch(setGameProps(game));
    },

    onGenerateTetramino: (tetramino, scoreOrField) => {
        const action = typeof scoreOrField === 'number' ? setScore : setField;

        store.dispatch(action(scoreOrField));
        store.dispatch(setCurrentTetramino(tetramino));
    },

    updateState: () => {
        const state = store.getState();
        const currentTetramino = selectCurrentTetramino(state);
        const isSinglePlayer = selectIsSinglePlayer(state);

        // new tetramino (single game)
        if (!currentTetramino) {
            isSinglePlayer && store.dispatch(generateTetramino());
            return;
        }

        const field = selectField(state);

        // tetramino increment
        if (!FieldModel.atBottom(field, currentTetramino)) {
            store.dispatch(moveBottomTetramino());
            return;
        }

        // update field
        const [updatedField, collapsedLines] = FieldModel.update(field, currentTetramino);

        !isSinglePlayer && GameModel.update(updatedField, collapsedLines);

        // final
        if (FieldModel.pileLineIsZero(updatedField)) {
            store.dispatch(finishGame());
            !isSinglePlayer && GameModel.finish();
            return;
        }

        store.dispatch(updateScore(collapsedLines));
        store.dispatch(updateGameState(updatedField));
    },

    setMode: (mode) => {
        store.dispatch(setMode(mode));
        store.dispatch(setModeGameList(mode));
    }
};

export default GameModel;