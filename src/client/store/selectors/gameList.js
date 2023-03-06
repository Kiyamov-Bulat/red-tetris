export const selectGameList = (state) => state.gameList;
export const selectGameListState = (state) => selectGameList(state).state;

export const selectGameListMode = (state) => selectGameList(state).mode;

export const selectGameListByMode = (state) => {
    const gameList = selectGameListState(state);
    const mode = selectGameListMode(state);

    return gameList.filter((game) => game.mode === mode);
};
