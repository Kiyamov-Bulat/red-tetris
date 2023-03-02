import React from 'react';
import {formatDateString} from "../../../utils/formatDateString";
import styles from './styles.module.scss';
import GameModel from "../../models/game";

const GameUnit = ({ index, game }) => {
    const connectToGame = () => {
        GameModel.connect(game.id);
    };

    return (
        <div className={styles.gameUnit} onClick={connectToGame}>
            <p className={styles.createdAt}>{formatDateString(game.createdAt)}</p>
            <div className={styles.info}>
                <p>{index}.</p>
                <p className={styles.id}>(<span>{game.id}</span>)</p>
                <p className={styles.host}>{game.host?.name || game.host?.id || 'unknown user'}</p>
            </div>
        </div>
    );
};

export default GameUnit;