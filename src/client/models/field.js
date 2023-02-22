import {TETRAMINO_COLOR, TETRAMINO_TYPE} from "./tetramino";

export const FIELD_SIZE = {
    columns: 10,
    lines: 20,
};


const getEmptyFieldLine = () => {
    return Array(FIELD_SIZE.columns).fill({ type: TETRAMINO_TYPE.E, color: TETRAMINO_COLOR[TETRAMINO_TYPE.E] } );
};

// export const FIELD = [...Array(FIELD_SIZE.lines)].map(() => getEmptyFieldLine());

const tempLine = getEmptyFieldLine();

tempLine[5] = { color: TETRAMINO_COLOR[TETRAMINO_TYPE.I], type: TETRAMINO_TYPE.I };

export const FIELD = [
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    [...tempLine],
    [...tempLine],
    [...tempLine],
    [...tempLine],
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
    getEmptyFieldLine(),
];
