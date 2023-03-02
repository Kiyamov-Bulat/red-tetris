import React, {memo} from 'react';
import styles from './styles.module.scss';
import FieldModel from "../../../models/field";
import {useSelector} from "react-redux";

export const CUBE_SIZE = {
    MINI: 12,
    FULL: 30,
};
const Cube = ({ size = CUBE_SIZE.FULL, playerId, column, line }) => {
    const color = useSelector(FieldModel.getCubeColorSelector(playerId, line, column));

    return (
        <div style={{
            background: color,
            width: `${size}px`,
            height: `${size}px`,
        }} className={styles.cube}></div>
    );
};

export default memo(Cube);