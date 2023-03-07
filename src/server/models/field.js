import {CUBE_TYPE, FIELD, RANDOM_FILLED_PART, TETRAMINO_TYPE} from "../../utils/constants";
import randomChoice from "../../utils/randomChoice";

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
        return newField;
    }

    static getEmpty() {
        return FIELD.reduce((acc, line) => [...acc, line.slice()], []);
    }

    static generateRandomFilled(part = RANDOM_FILLED_PART) {
        const field = this.getEmpty();
        const index = Math.round((1 - part) * field.length);

        for (let i = index; i < field.length; ++i) {
            const line = field[i];
            
            for (let j = 0; j < line.length; ++j) {
                const filled = Math.random() >= 0.5;
                
                if (filled) {
                    line[j] = { ...line[j], type: randomChoice(Object.values(TETRAMINO_TYPE)) };
                }
            }
            if (line.every((cube) => cube.type !== CUBE_TYPE.EMPTY)) {
                const emptyIndex = randomChoice([...Array(line.length).keys()]);

                line[emptyIndex] = CUBE_TYPE.EMPTY;
            }
        }
        return field;
    }
}

export default Field;