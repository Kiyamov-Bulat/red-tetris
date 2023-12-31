import {
    FIELD_SIZE,
    INITIAL_TETRAMINO_POSITION,
    TETRAMINO_COORDS,
    TETRAMINO_ROTATE,
    TETRAMINO_TYPE
} from "../../utils/constants";
import randomChoice from "../../utils/randomChoice";

class Tetramino {
    static GENERATE_TYPE = null;

    constructor(type, position, rotation) {
        this.type = type;
        this.position = position;
        this.rotation = rotation;
    }

    static _setGeneratorType(type) {
        this.GENERATE_TYPE = Object.values(TETRAMINO_TYPE).includes(type) ? type : null;
    }
    /**
     * @static
     */
    static generate() {
        const tetramino = new Tetramino(
            this.GENERATE_TYPE ? this.GENERATE_TYPE : randomChoice(Object.values(TETRAMINO_TYPE)),
            { ...INITIAL_TETRAMINO_POSITION },
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