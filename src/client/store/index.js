import {configureStore} from "@reduxjs/toolkit";
import game from "../store/slices/game";
import player from "../store/slices/player";
import gameList from "../store/slices/gameList";

export const setupStore = preloadedState => {
    return configureStore({
        reducer: {
            game,
            player,
            gameList,
        },
        preloadedState
    });
};

const store = setupStore();

export default store;