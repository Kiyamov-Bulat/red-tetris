export const selectField = (state) => state.field.field;

export const getSelectLine = (idx) => (state) => selectField(state)[idx];

export const getSelectCube = (line, column) => (state) => getSelectLine(line)(state)[column];
