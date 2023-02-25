import {configureStore} from "@reduxjs/toolkit";
import game from "../store/slices/game";
import player from "../store/slices/player";
import gameList from "../store/slices/gameList";

const store = configureStore({
    reducer: {
        game,
        player,
        gameList,
    }
});

export default store;