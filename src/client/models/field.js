import TetraminoModel, {CUBE_COLOR} from "./tetramino";
import {
    CUBE_TYPE,
    FIELD,
    FIELD_SIZE,
    RANDOM_FILLED_PART,
    TETRAMINO_COORDS,
    TETRAMINO_TYPE
} from "../../utils/constants";
import {selectCurrentTetramino, selectField, selectOpponentsFields} from "../store/selectors/game";
import sessionStorageService from "../services/sessionStorageService";
import appStore from "../store";
import randomChoice from "../../utils/randomChoice";

const getEmptyFieldLine = () => {
    return Array(FIELD_SIZE.column).fill({ type: CUBE_TYPE.EMPTY });
};

const getLockedFieldLine = () => {
    return Array(FIELD_SIZE.column).fill({ type: CUBE_TYPE.LOCKED });
};

const FieldModel = {
    getEmpty: () => {
        return FIELD.reduce((acc, line) => [...acc, line.slice()], []);
    },

    generateRandomFilled: (part = RANDOM_FILLED_PART) => {
        const field = FieldModel.getEmpty();
        const index = Math.round((1 - part) * field.length);

        for (let i = index; i < field.length; ++i) {
            const line = field[i];

            for (let j = 0; j < line.length; ++j) {
                const filled = Math.random() >= 0.5;

                if (filled) {
                    line[j] = { ...line[j], type: randomChoice(Object.values(TETRAMINO_TYPE)) };
                }
            }
            if (line.every((cube) => cube.type !== CUBE_TYPE.EMPTY)) {
                const emptyIndex = randomChoice([...Array(line.length).keys()]);

                line[emptyIndex] = CUBE_TYPE.EMPTY;
            }
        }
        return field;
    },

    update: (field, landedTetramino) => {
        const newField = field.reduce((acc, line) => [...acc, line.slice()], []);

        TetraminoModel.getCubes(landedTetramino).forEach((cube) => {
            newField[cube.line][cube.column] = { type: landedTetramino.type };
        });

        let collapsedLines = 0;

        newField.slice().forEach((line, idx) => {
            if (line[0].type === CUBE_TYPE.LOCKED) {
                return;
            }

            if (line.every((column) => column.type !== CUBE_TYPE.EMPTY && column)) {
                newField.splice(idx - collapsedLines, 1);
                collapsedLines += 1;
            }
        });

        for (let i = 0; i < collapsedLines; ++i) {
            newField.unshift(getEmptyFieldLine());
        }

        return [newField, collapsedLines];
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

    cubeIsEmpty: (field, line, column) => {
        return (line >= field.length || line < 0 || field[line][column].type === CUBE_TYPE.EMPTY);
    },

    getPileLine: (field, tetramino) => {
        let i;
        const cubes = TetraminoModel.getCubes(tetramino);

        for (i = 0; i < field.length; ++i) {
            if (cubes.some((cube) => field[i][cube.column].type !== CUBE_TYPE.EMPTY)) {
                return i;
            }
        }
        return i;
    },

    getCube: (playerId, line, column, store = appStore) => {
        const state = store.getState();
        const field = playerId === sessionStorageService.getSessionId()
            ? selectField(state)
            : selectOpponentsFields(state).find((next) => next.player.id === playerId)?.field;

        return field ? field[line][column] : CUBE_TYPE.EMPTY;
    },

    isMainField: (playerId) => {
        return playerId === sessionStorageService.getSessionId();
    },

    getCubeColorSelector: (playerId, line, column) => (state) => {
        const tetramino = selectCurrentTetramino(state);
        const type = FieldModel.isMainField(playerId) && TetraminoModel.isTetraminoCube(tetramino, line, column)
            ? tetramino.type
            : FieldModel.getCube(playerId, line, column).type;

        return CUBE_COLOR[type];
    },
    
    lockNLines: (fieldState, n) => {
        const field = [...fieldState];
        
        for (let i = fieldState.length - 1; i >= 0 && n > 0; --i) {
            if (field[i][0].type !== CUBE_TYPE.LOCKED) {
                field[i] = getLockedFieldLine();
                --n;
            }
        }
        return field;
    },
    pileLineIsZero: (field) => {
        return field[0].some((column) => column.type !== CUBE_TYPE.EMPTY);
    }
};

export default FieldModel;