import {configureStore} from "@reduxjs/toolkit";
import cube from "../store/slices/cube";
import game from "../store/slices/game";

const store = configureStore({
    reducer: {
        cube,
        game,
    }
});

export default store;