import React from 'react';
import {formatDateString} from "../../../utils/formatDateString";
import styles from './styles.module.scss';
import GameModel from "../../models/game";

export const GAME_UNIT_TEST_ID = 'game-unit';

const GameUnit = ({ index, game }) => {
    const connectToGame = () => {
        GameModel.connect(game.id);
    };

    return (
        <div data-testid={GAME_UNIT_TEST_ID} className={styles.gameUnit} onClick={connectToGame}>
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