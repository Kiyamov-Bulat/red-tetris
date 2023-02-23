import randomChoice from "../../utils/randomChoice";
import {FIELD_SIZE} from "../../utils/constants";

class Tetramino {
    static TYPE = {
        I: 'straight tetromino',
        O: 'square tetromino',
        T: 'T-tetromino',
        J: 'J-tetromino',
        L: 'L-tetromino',
        S: 'skew tetromino',
        Z: 'Z-tetramino',
    };

    static ROTATE = {
        TWELVE: '0',
        THREE: '90',
        SIX: '180',
        NINE: '270',
    };

    static COORDS = {
        [Tetramino.TYPE.I]: {
            [Tetramino.ROTATE.TWELVE]: [[0, -2], [0, -1], [0, 1]],
            [Tetramino.ROTATE.THREE]: [[-1, 0], [1, 0], [2, 0]],
            [Tetramino.ROTATE.SIX]: [[0, -2], [0, -1], [0, 1]],
            [Tetramino.ROTATE.NINE]: [[-1, 0], [1, 0], [2, 0]],
        },
        [Tetramino.TYPE.O]: {
            [Tetramino.ROTATE.TWELVE]: [[1, 0], [0, 1], [1, 1]],
            [Tetramino.ROTATE.THREE]: [[1, 0], [0, 1], [1, 1]],
            [Tetramino.ROTATE.SIX]: [[1, 0], [0, 1], [1, 1]],
            [Tetramino.ROTATE.NINE]: [[1, 0], [0, 1], [1, 1]],
        },
        [Tetramino.TYPE.T]: {
            [Tetramino.ROTATE.TWELVE]: [[-1, 0], [1, 0], [0, 1]],
            [Tetramino.ROTATE.THREE]: [[0, -1], [0, 1], [-1, 0]],
            [Tetramino.ROTATE.SIX]: [[-1, 0], [1, 0], [0, -1]],
            [Tetramino.ROTATE.NINE]: [[0, -1], [0, 1], [1, 0]],
        },
        [Tetramino.TYPE.J]: {
            [Tetramino.ROTATE.TWELVE]: [[0, -1], [0, 1], [-1, 1]],
            [Tetramino.ROTATE.THREE]: [[1, 0], [-1, 0], [-1, -1]],
            [Tetramino.ROTATE.SIX]: [[0, 1], [0, -1], [1, -1]],
            [Tetramino.ROTATE.NINE]: [[-1, 0], [1, 0], [1, 1]],
        },
        [Tetramino.TYPE.L]: {
            [Tetramino.ROTATE.TWELVE]: [[0, -1], [0, 1], [1, 1]],
            [Tetramino.ROTATE.THREE]: [[1, 0], [-1, 0], [-1, 1]],
            [Tetramino.ROTATE.SIX]: [[0, 1], [0, -1], [-1, -1]],
            [Tetramino.ROTATE.NINE]: [[-1, 0], [1, 0], [1, -1]],
        },
        [Tetramino.TYPE.S]: {
            [Tetramino.ROTATE.TWELVE]: [[1, 0], [0, 1], [-1, 1]],
            [Tetramino.ROTATE.THREE]: [[0, -1], [1, 0], [1, 1]],
            [Tetramino.ROTATE.SIX]: [[1, 0], [0, 1], [-1, 1]],
            [Tetramino.ROTATE.NINE]: [[0, -1], [1, 0], [1, 1]],
        },
        [Tetramino.TYPE.Z]: {
            [Tetramino.ROTATE.TWELVE]: [[-1, 0], [0, 1], [1, 1]],
            [Tetramino.ROTATE.THREE]: [[0, -1], [-1, 0], [-1, 1]],
            [Tetramino.ROTATE.SIX]: [[-1, 0], [0, 1], [1, 1]],
            [Tetramino.ROTATE.NINE]: [[0, -1], [-1, 0], [-1, 1]],
        },
    }
    constructor(type, position, rotation) {
        this.type = type;
        this.position = position;
        this.rotation = rotation;
    }

    /**
     * @static
     */
    static generate() {
        const tetramino = new Tetramino(
            randomChoice(Object.values(Tetramino.TYPE)),
            { column: 4, line: 0 },
            Tetramino.ROTATE.TWELVE,
        );

        const topmostCube = this.getTopmostCube(tetramino);

        tetramino.position.line -= topmostCube.line;
        return tetramino;
    }

    getTopmostCube() {
        return this.getCubes().reduce((acc, cube) => (
            acc.line > cube.line ? cube : acc
        ), { ...FIELD_SIZE });
    }

    getCubes() {
        const res = [];
        const localCoords = [[0, 0], ...Tetramino.COORDS[this.type][this.rotation]];

        for (const localCoord of localCoords) {
            res.push({
                column: this.position.column + localCoord[0],
                line: this.position.line + localCoord[1]
            });
        }
        return res;
    }
}

export default Tetramino;