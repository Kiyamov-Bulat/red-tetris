import {FIELD_SIZE, TETRAMINO_COORDS, TETRAMINO_ROTATE, TETRAMINO_TYPE} from "../../utils/constants";

class Tetramino {
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
            TETRAMINO_TYPE.I,//randomChoice(Object.values(TETRAMINO_TYPE)),
            { column: 4, line: 0 },
            TETRAMINO_ROTATE.TWELVE,
        );

        const topmostCube = tetramino.getTopmostCube(tetramino);

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
        const localCoords = [[0, 0], ...TETRAMINO_COORDS[this.type][this.rotation]];

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