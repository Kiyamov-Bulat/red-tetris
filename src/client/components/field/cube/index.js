import React from 'react';
import styles from './styles.module.scss';
import TetraminoModel, {TETRAMINO_COLOR} from "../../../models/tetramino";
import {useSelector} from "react-redux";
import {selectCurrentTetramino} from "../../../store/selectors/game";

const Cube = ({ line, column, state }) => {
    const tetramino = useSelector(selectCurrentTetramino);
    const isActive = TetraminoModel.isTetraminoCube(tetramino, line, column);

    return (
        <div style={{ background: TETRAMINO_COLOR[isActive ? tetramino.type : state.type] }} className={styles.cube}></div>
    );
};

export default Cube;