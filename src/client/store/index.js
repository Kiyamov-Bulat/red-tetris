import {configureStore} from "@reduxjs/toolkit";
import cube from "../store/slices/cube";
import field from "../store/slices/field";

const store = configureStore({
    reducer: {
        cube,
        field,
    }
});

export default store;