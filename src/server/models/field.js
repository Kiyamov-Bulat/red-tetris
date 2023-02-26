import {CUBE_TYPE} from "../../utils/constants";

class Field {
    static transformToSpectatorField(field) {
        const newField = [];
        const topmostColumns = [];

        field.forEach((columns, line) => {
            newField[line] = [];

            columns.forEach((columnState, column) => {
                let type = CUBE_TYPE.EMPTY;

                if (columnState.type !== CUBE_TYPE.EMPTY && !topmostColumns[column]) {
                    type = CUBE_TYPE.TOPMOST;
                    topmostColumns[column] = true;
                }
                newField[line][column] = { ...field[line][column], type };
           });
        });
    }
}

export default Field;