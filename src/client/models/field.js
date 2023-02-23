import TetraminoModel, {TETRAMINO_TYPE} from "./tetramino";
import {FIELD_SIZE} from "../utils/constants";
import {CUBE_TYPE} from "./cube";
import {current} from "@reduxjs/toolkit";


const getEmptyFieldLine = () => {
    return Array(FIELD_SIZE.column).fill({ type: CUBE_TYPE.EMPTY });
};

export const FIELD = [...Array(FIELD_SIZE.line)].map(() => getEmptyFieldLine());

const FieldModel = {
    update: (field, landedTetramino) => {
        const newField = [...field];
        
        TetraminoModel.getCubes(landedTetramino).forEach((cube) => {
            newField[cube.line][cube.column] = { type: landedTetramino.type };
        });
        let collapsedLines = 0;

        newField.slice().forEach((line, idx) => {
            if (line.every((column) => column.type !== CUBE_TYPE.EMPTY)) {
                newField.splice(idx - collapsedLines, 1);
                collapsedLines += 1;
            }
        });

        for (let i = 0; i < collapsedLines; ++i) {
            newField.unshift(getEmptyFieldLine());
        }

        return newField;
    },

    atRight: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            (cube.column === FIELD_SIZE.column - 1) ||
            field[cube.line][cube.column + 1].type !== CUBE_TYPE.EMPTY
        );
    },

    atLeft: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            (cube.column === 0) || field[cube.line][cube.column - 1].type !== CUBE_TYPE.EMPTY
        );
    },

    atBottom: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
                cube.line >= 0 && (
                    (cube.line === FIELD_SIZE.line - 1) ||
                    field[cube.line + 1][cube.column].type !== CUBE_TYPE.EMPTY
                )
        );
    },

    getPileLine: (field, column) => {
        let i;

        for (i = 0; i < field.length; ++i) {
            console.log(current(field[i][column]));
            if (field[i][column].type !== CUBE_TYPE.EMPTY) {
                return i;
            }
        }
        return i;
    }
};

export default FieldModel;