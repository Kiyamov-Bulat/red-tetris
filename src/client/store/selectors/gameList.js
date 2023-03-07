import {selectGameMode} from "./game";

export const selectGameList = (state) => state.gameList;
export const selectGameListState = (state) => selectGameList(state).state;

export const selectGameListByMode = (state) => {
    const gameList = selectGameListState(state);
    const mode = selectGameMode(state);

    return gameList.filter((game) => game.mode === mode);
};
