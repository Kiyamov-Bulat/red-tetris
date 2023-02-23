import TetraminoModel, {TETRAMINO_TYPE} from "./tetramino";
import {FIELD_SIZE} from "../utils/constants";


const getEmptyFieldLine = () => {
    return Array(FIELD_SIZE.column).fill({ type: TETRAMINO_TYPE.EMPTY });
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
            if (line.every((column) => column.type !== TETRAMINO_TYPE.EMPTY)) {
                newField.splice(idx - collapsedLines, 1);
                collapsedLines += 1;
            }
        });

        for (let i = 0; i < collapsedLines; ++i) {
            newField.unshift(getEmptyFieldLine());
        }

        return newField;
    }       
};

export default FieldModel;