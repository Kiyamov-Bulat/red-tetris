import randomChoice from "../utils/randomChoice";
import {FIELD_SIZE} from "../utils/constants";
import {current} from "@reduxjs/toolkit";

export const TETRAMINO_TYPE = {
    EMPTY: 'empty',
    I: 'straight tetromino',
    O: 'square tetromino',
    T: 'T-tetromino',
    J: 'J-tetromino',
    L: 'L-tetromino',
    S: 'skew tetromino',
    Z: 'Z-tetramino',
};

export const TETRAMINO_COLOR = {
    [TETRAMINO_TYPE.EMPTY]: '#e1e1e1',
    [TETRAMINO_TYPE.I]: '#00eaff',
    [TETRAMINO_TYPE.O]: '#ffdd00',
    [TETRAMINO_TYPE.T]: '#e600ff',
    [TETRAMINO_TYPE.J]: '#0039ff',
    [TETRAMINO_TYPE.L]: '#ff4400',
    [TETRAMINO_TYPE.S]: '#48ff00',
    [TETRAMINO_TYPE.Z]: '#ff0015',
};

export const TETRAMINO_ROTATE = {
    TWELVE: '0',
    THREE: '90',
    SIX: '180',
    NINE: '270',
};

export const NEXT_TETRAMINO_ROTATE = {
    [TETRAMINO_ROTATE.TWELVE]: TETRAMINO_ROTATE.THREE,
    [TETRAMINO_ROTATE.THREE]: TETRAMINO_ROTATE.SIX,
    [TETRAMINO_ROTATE.SIX]: TETRAMINO_ROTATE.NINE,
    [TETRAMINO_ROTATE.NINE]: TETRAMINO_ROTATE.TWELVE,
};

const TETRAMINO_COORDS = {
    [TETRAMINO_TYPE.I]: {
        [TETRAMINO_ROTATE.TWELVE]: [[0, -2], [0, -1], [0, 1]],
        [TETRAMINO_ROTATE.THREE]: [[-1, 0], [1, 0], [2, 0]],
        [TETRAMINO_ROTATE.SIX]: [[0, -2], [0, -1], [0, 1]],
        [TETRAMINO_ROTATE.NINE]: [[-1, 0], [1, 0], [2, 0]],
    },
    [TETRAMINO_TYPE.O]: {
        [TETRAMINO_ROTATE.TWELVE]: [[1, 0], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.THREE]: [[1, 0], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.SIX]: [[1, 0], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.NINE]: [[1, 0], [0, 1], [1, 1]],
    },
    [TETRAMINO_TYPE.T]: {
        [TETRAMINO_ROTATE.TWELVE]: [[-1, 0], [1, 0], [0, 1]],
        [TETRAMINO_ROTATE.THREE]: [[0, -1], [0, 1], [-1, 0]],
        [TETRAMINO_ROTATE.SIX]: [[-1, 0], [1, 0], [0, -1]],
        [TETRAMINO_ROTATE.NINE]: [[0, -1], [0, 1], [1, 0]],
    },
    [TETRAMINO_TYPE.J]: {
        [TETRAMINO_ROTATE.TWELVE]: [[0, -1], [0, 1], [-1, 1]],
        [TETRAMINO_ROTATE.THREE]: [[1, 0], [-1, 0], [-1, -1]],
        [TETRAMINO_ROTATE.SIX]: [[0, 1], [0, -1], [1, -1]],
        [TETRAMINO_ROTATE.NINE]: [[-1, 0], [1, 0], [1, 1]],
    },
    [TETRAMINO_TYPE.L]: {
        [TETRAMINO_ROTATE.TWELVE]: [[0, -1], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.THREE]: [[1, 0], [-1, 0], [-1, 1]],
        [TETRAMINO_ROTATE.SIX]: [[0, 1], [0, -1], [-1, -1]],
        [TETRAMINO_ROTATE.NINE]: [[-1, 0], [1, 0], [1, -1]],
    },
    [TETRAMINO_TYPE.S]: {
        [TETRAMINO_ROTATE.TWELVE]: [[1, 0], [0, 1], [-1, 1]],
        [TETRAMINO_ROTATE.THREE]: [[0, -1], [1, 0], [1, 1]],
        [TETRAMINO_ROTATE.SIX]: [[1, 0], [0, 1], [-1, 1]],
        [TETRAMINO_ROTATE.NINE]: [[0, -1], [1, 0], [1, 1]],
    },
    [TETRAMINO_TYPE.Z]: {
        [TETRAMINO_ROTATE.TWELVE]: [[-1, 0], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.THREE]: [[0, -1], [-1, 0], [-1, 1]],
        [TETRAMINO_ROTATE.SIX]: [[-1, 0], [0, 1], [1, 1]],
        [TETRAMINO_ROTATE.NINE]: [[0, -1], [-1, 0], [-1, 1]],
    },
};

const TetraminoModel = {
    generate: () => {
        return {
            type: TETRAMINO_TYPE.L,// randomChoice(Object.values(TETRAMINO_TYPE).filter((type) => type !== TETRAMINO_TYPE.EMPTY)),
            position: { column: 4, line: 0 },
            rotation: TETRAMINO_ROTATE.TWELVE,
        };
    },
    
    getCubes: (tetramino) => {
        const res = [];
        const localCoords = [[0, 0], ...TETRAMINO_COORDS[tetramino.type][tetramino.rotation]];

        for (const localCoord of localCoords) {
            res.push({
                column: tetramino.position.column + localCoord[0],
                line: tetramino.position.line + localCoord[1]
            });
        }
        return res;
    },

    isTetraminoCube: (tetramino, cubeLine, cubeColumn) => {
        if (!tetramino) {
            return false;
        }

        return TetraminoModel.getCubes(tetramino).some((cube) =>
            cube.column === cubeColumn && cube.line === cubeLine
        );
    },

    incrementLine: (tetramino) => {
        return { ...tetramino, position: { ...tetramino.position, line: tetramino.position.line + 1 }};
    },

    moveLeft: (field, tetramino) => {
        if (!tetramino) {
            return tetramino;
        }

        const newTetramino = { ...tetramino };

        if (!TetraminoModel.atFieldLeft(field, tetramino)) {
            newTetramino.position = {
                ...newTetramino.position,
                column: newTetramino.position.column - 1
            };
        }

        return newTetramino;
    },
    
    moveRight: (field, tetramino) => {
        if (!tetramino) {
            return tetramino;
        }

        const newTetramino = { ...tetramino };

        if (!TetraminoModel.atFieldRight(field, tetramino)) {
            newTetramino.position = {
                ...newTetramino.position,
                column: newTetramino.position.column + 1
            };
        }

        return newTetramino;
    },

    moveBottom: (field, tetramino) => {
        if (!tetramino) {
            return tetramino;
        }
        if (!TetraminoModel.atFieldBottom(field, tetramino)) {
            return TetraminoModel.incrementLine(tetramino);
        }
        return { ...tetramino };
    },

    rotate: (tetramino) => {
        if (!tetramino) {
            return tetramino;
        }

        return { ...tetramino, rotation: NEXT_TETRAMINO_ROTATE[tetramino.rotation] };
    },

    getLeftmostCube: (tetramino) => {
        return TetraminoModel.getCubes(tetramino).reduce((acc, cube) => (
            acc.column > cube.column ? cube : acc
        ), { ...FIELD_SIZE });
    },

    getRightmostCube: (tetramino) => {
        return TetraminoModel.getCubes(tetramino).reduce((acc, cube) => (
            acc.column > cube.column ? acc : cube
        ), { column: 0, line: 0 });
    },

    getLowestCube: (tetramino) => {
        return TetraminoModel.getCubes(tetramino).reduce((acc, cube) => (
            acc.line > cube.line ? acc : cube
        ), { column: 0, line: 0 });
    },

    atFieldRight: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            (cube.column === FIELD_SIZE.column - 1) ||
            field[cube.line][cube.column + 1].type !== TETRAMINO_TYPE.EMPTY
        );
    },

    atFieldLeft: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            (cube.column === 0) || field[cube.line][cube.column - 1].type !== TETRAMINO_TYPE.EMPTY
        );
    },

    atFieldBottom: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            cube.line >= 0 && (
                (cube.line === FIELD_SIZE.line - 1) ||
                field[cube.line + 1][cube.column].type !== TETRAMINO_TYPE.EMPTY
            )
        );
    },
};

export default TetraminoModel;