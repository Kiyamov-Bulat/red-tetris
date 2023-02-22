import {createSlice} from "@reduxjs/toolkit";
import {FIELD} from "../../models/field";

const fieldState = {
    field: [ ...FIELD ],
};

const field = createSlice({
    name: "field",
    initialState: fieldState,
    reducers: {

    }
});


export default field.reducer;