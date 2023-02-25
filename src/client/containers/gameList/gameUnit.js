import React from 'react';
import {formatDateString} from "../../../utils/formatDateString";
import styles from './styles.module.scss';
import {useDispatch} from "react-redux";
import Game from "../../models/game";

const GameUnit = ({ index, game }) => {
    const dispatch = useDispatch();
    
    const connectToGame = () => {
        Game.connect(game.id);
    };

    return (
        <div className={styles.gameUnit}>
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