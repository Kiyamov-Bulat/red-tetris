import {configureStore} from "@reduxjs/toolkit";
import game from "../store/slices/game";
import player from "../store/slices/player";

const store = configureStore({
    reducer: {
        game,
        player,
    }
});

export default store;