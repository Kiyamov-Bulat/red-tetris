import {FIELD_SIZE} from "../../utils/constants";
import randomChoice from "../../utils/randomChoice";

export const TETRAMINO_TYPE = {
    I: 'straight tetromino',
    O: 'square tetromino',
    T: 'T-tetromino',
    J: 'J-tetromino',
    L: 'L-tetromino',
    S: 'skew tetromino',
    Z: 'Z-tetramino',
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


export const CUBE_TYPE = {
    EMPTY: 'empty',
    LOCKED: 'locked',
    ...TETRAMINO_TYPE,
};

export const EMPTY_CUBE_TYPE = CUBE_TYPE.EMPTY;

export const CUBE_COLOR = {
    [CUBE_TYPE.EMPTY]: '#e1e1e1',
    [CUBE_TYPE.I]: '#00eaff',
    [CUBE_TYPE.O]: '#ffdd00',
    [CUBE_TYPE.T]: '#e600ff',
    [CUBE_TYPE.J]: '#0039ff',
    [CUBE_TYPE.L]: '#ff4400',
    [CUBE_TYPE.S]: '#48ff00',
    [CUBE_TYPE.Z]: '#ff0015',
};

const TetraminoModel = {
    generate: () => {
        const tetramino = {
            type: randomChoice(Object.values(TETRAMINO_TYPE)),
            position: { column: 4, line: 0 },
            rotation: TETRAMINO_ROTATE.TWELVE,
        };
        const topmostCube = TetraminoModel.getTopmostCube(tetramino);

        tetramino.position.line -= topmostCube.line;
        return tetramino;
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

    moveLeft: (tetramino) => {
        return { ...tetramino, position: {
            ...tetramino.position,
            column: tetramino.position.column - 1
        }};
    },
    
    moveRight: (tetramino) => {
        return { ...tetramino, position: {
            ...tetramino.position,
            column: tetramino.position.column + 1
        }};
    },

    moveBottom: (tetramino) => {
        return TetraminoModel.incrementLine(tetramino);
    },

    moveToPile: (tetramino, pileLine) => {
        const lowestCube = TetraminoModel.getLowestCube(tetramino);

        return { ...tetramino, position: {
            ...tetramino.position,
            line: tetramino.position.line - lowestCube.line + pileLine - 1,
        }};
    },

    rotate: (tetramino) => {
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

    getTopmostCube: (tetramino) => {
        return TetraminoModel.getCubes(tetramino).reduce((acc, cube) => (
            acc.line > cube.line ? cube : acc
        ), { ...FIELD_SIZE });
    },

    outsideLeftEdge: (tetramino) => {
        return TetraminoModel.getLeftmostCube(tetramino).column < 0;
    },

    outsideRightEdge: (tetramino) => {
        return TetraminoModel.getRightmostCube(tetramino).column >= FIELD_SIZE.column;
    },

    intersectsPile: (field, tetramino) => {
        return TetraminoModel.getCubes(tetramino).some((cube) =>
            field[cube.line][cube.column].type !== CUBE_TYPE.EMPTY
        );
    },
};

export default TetraminoModel;