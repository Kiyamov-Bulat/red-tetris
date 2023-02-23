export const selectPlayer = (state) => state.player;

export const selectPlayerIsWinner = (state) => selectPlayer(state).isWinner;