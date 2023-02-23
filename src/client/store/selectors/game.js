export const selectGame = (state) => state.game;
export const selectCurrentTetramino = (state) => selectGame(state).currentTetramino;

export const selectField = (state) => selectGame(state).field;

export const getSelectLine = (idx) => (state) => selectField(state)[idx];

export const getSelectCube = (line, column) => (state) => getSelectLine(line)(state)[column];
