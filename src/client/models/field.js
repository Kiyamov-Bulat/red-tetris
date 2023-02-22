import {TETRAMINO_TYPE} from "./tetramino";
import {FIELD_SIZE} from "../utils/constants";


const getEmptyFieldLine = () => {
    return Array(FIELD_SIZE.column).fill({ type: TETRAMINO_TYPE.E });
};

export const FIELD = [...Array(FIELD_SIZE.line)].map(() => getEmptyFieldLine());
