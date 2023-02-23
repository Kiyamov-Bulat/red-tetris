import {TETRAMINO_TYPE} from "./tetramino";

export const CUBE_TYPE = {
    EMPTY: 'empty',
    LOCKED: 'locked',
    ...TETRAMINO_TYPE,
};

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