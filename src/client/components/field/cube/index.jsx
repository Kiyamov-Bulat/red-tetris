import React from 'react';
import styles from './styles.module.scss';
import {useSelector} from "react-redux";
import FieldModel from "../../../models/field";

export const CUBE_SIZE = {
    MINI: 12,
    FULL: 30,
};

export const CUBE_TEST_ID = 'cube-test-id';

const Cube = ({ size = CUBE_SIZE.FULL, playerId, column, line }) => {
    const color = useSelector(FieldModel.getCubeColorSelector(playerId, line, column));

    return (
        <div data-testid={CUBE_TEST_ID} style={{
            background: color,
            width: `${size}px`,
            height: `${size}px`,
        }} className={styles.cube}></div>
    );
};

export default Cube;