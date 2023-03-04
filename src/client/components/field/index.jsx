import React from 'react';
import Cube, {CUBE_SIZE} from "./cube";
import sessionStorageService from "../../services/sessionStorageService";
import FieldModel from "../../models/field";
import {FIELD_SIZE} from "../../../utils/constants";
import styles from './styles.module.scss';

const CUBE_GAP = 1;

const Field = ({ state, playerId = sessionStorageService.getSessionId() }) => {
    const cubeSize = FieldModel.isMainField(playerId) ? CUBE_SIZE.FULL : CUBE_SIZE.MINI;
    const fieldWidth = (cubeSize + CUBE_GAP) * FIELD_SIZE.column;
    const fieldHeight = (cubeSize + CUBE_GAP) * FIELD_SIZE.line;

    return (
        <div style={{ width: `${fieldWidth}px`, height: `${fieldHeight}px`, gap: CUBE_GAP }}
             className={styles.field}
        >
            {state.map((cubes, line) => cubes.map((cube, column) => {

                return <Cube key={`${line}-${column}`}
                             size={cubeSize}
                             playerId={playerId}
                             line={line}
                             column={column}
                />;
            }))}
        </div>
    );
};

export default Field;