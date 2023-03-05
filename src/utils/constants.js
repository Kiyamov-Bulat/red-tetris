export const INITIAL_TETRAMINO_POSITION = { column: 4, line: 0 };

export const FIELD_SIZE = {
    column: 10,
    line: 20
};

export const GAME_SOCKET_EVENT = {
    GET_ALL: 'game:get_all',
    CREATE: 'game:create',
    CONNECT: 'game:connect',
    START: 'game:restart',
    GENERATE_TETRAMINO: 'game:generate_tetramino',
    UPDATE: 'game:update',
    FINISH: 'game:finish',
    DESTROY: 'game:destroy',
    KICK: 'game:kick',
    LEAVE: 'game:leave',
    HOST_CHANGE: 'game:host_change',
};


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

export const TETRAMINO_COORDS = {
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
    TOPMOST: 'topmost',
    ...TETRAMINO_TYPE,
};
