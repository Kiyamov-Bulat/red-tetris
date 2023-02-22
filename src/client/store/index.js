import {configureStore} from "@reduxjs/toolkit";
import cube from "../store/slices/cube";
import field from "../store/slices/field";
import game from "../store/slices/game";

const store = configureStore({
    reducer: {
        cube,
        field,
        game,
    }
});

export default store;