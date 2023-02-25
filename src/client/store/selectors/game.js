import {SIDE_PANEL_TYPE} from "../../models/game";

export const selectGame = (state) => state.game;
export const selectCurrentTetramino = (state) => selectGame(state).currentTetramino;

export const selectField = (state) => selectGame(state).field;

export const getSelectLine = (idx) => (state) => selectField(state)[idx];

export const getSelectCube = (line, column) => (state) => getSelectLine(line)(state)[column];

export const selectGameIsOver = (state) => selectGame(state).isOver;

export const selectGameIsStarted = (state) => selectGame(state).isStarted;

export const selectGameId = (state) => selectGame(state).id;

export const selectGameHost = (state) => selectGame(state).host;

export const selectSidePanelType = (state) => {
    const host = selectGameHost(state);
    const isGameStarted = selectGameIsStarted(state);

    if (!host) {
        return SIDE_PANEL_TYPE.MAIN;
    }
    return isGameStarted ? SIDE_PANEL_TYPE.FIELDS : SIDE_PANEL_TYPE.WAIT_START;
};

export const selectOpponentsFields = (state) => selectGame(state).opponentsFields;