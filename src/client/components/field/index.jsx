import React from 'react';
import Cube, {CUBE_SIZE} from "./cube";
import sessionStorageService from "../../services/sessionStorageService";
import FieldModel from "../../models/field";
import {FIELD_SIZE} from "../../../utils/constants";
import styles from './styles.module.scss';
import Score from "./score";

const CUBE_GAP = 1;

const Field = ({ state, playerId = sessionStorageService.getSessionId() }) => {
    const cubeSize = FieldModel.isMainField(playerId) ? CUBE_SIZE.FULL : CUBE_SIZE.MINI;
    const fieldWidth = (cubeSize + CUBE_GAP) * FIELD_SIZE.column;
    const fieldHeight = (cubeSize + CUBE_GAP) * FIELD_SIZE.line;
    const style = {
        minWidth: `${fieldWidth}px`,
        minHeight: `${fieldHeight}px`,
        width: `${fieldWidth}px`,
        height: `${fieldHeight}px`,
        gap: CUBE_GAP
    };

    return (
        <div style={style}
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
            <Score playerId={playerId}/>
        </div>
    );
};

export default Field;