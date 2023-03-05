import {
    CUBE_TYPE,
    FIELD_SIZE, INITIAL_TETRAMINO_POSITION,
    NEXT_TETRAMINO_ROTATE,
    TETRAMINO_COORDS,
    TETRAMINO_ROTATE,
    TETRAMINO_TYPE
} from "../../utils/constants";
import randomChoice from "../../utils/randomChoice";
export const CUBE_COLOR = {
    [CUBE_TYPE.EMPTY]: '#e1e1e1',
    [CUBE_TYPE.LOCKED]: '#1a1a1a',
    [CUBE_TYPE.TOPMOST]: '#676767',
    [CUBE_TYPE.I]: '#00eaff',
    [CUBE_TYPE.O]: '#ffdd00',
    [CUBE_TYPE.T]: '#e600ff',
    [CUBE_TYPE.J]: '#0039ff',
    [CUBE_TYPE.L]: '#ff4400',
    [CUBE_TYPE.S]: '#48ff00',
    [CUBE_TYPE.Z]: '#ff0015',
};

const TetraminoModel = {
    GENERATE_TYPE: null,

    setGenerateType(type) {
        TetraminoModel.GENERATE_TYPE = Object.values(TETRAMINO_TYPE).includes(type) ? type : null;
    },

    generate: () => {
        const tetramino = {
            type: TetraminoModel.GENERATE_TYPE || randomChoice(Object.values(TETRAMINO_TYPE)),
            position: { ...INITIAL_TETRAMINO_POSITION },
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