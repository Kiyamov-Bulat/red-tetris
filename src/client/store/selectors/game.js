export const selectGame = (state) => state.game;
export const selectCurrentTetramino = (state) => selectGame(state).currentTetramino;