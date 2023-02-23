import {configureStore} from "@reduxjs/toolkit";
import game from "../store/slices/game";

const store = configureStore({
    reducer: {
        game,
    }
});

export default store;