import {selectIsSinglePlayer} from "./game";

export const selectPlayer = (state) => state.player;

export const selectPlayerIsWinner = (state) => selectIsSinglePlayer(state) ? false : selectPlayer(state).isWinner;

export const selectPlayerScore = (state) => selectPlayer(state).score || 0;
