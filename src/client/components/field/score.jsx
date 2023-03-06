import React from 'react';
import {useSelector} from "react-redux";
import PlayerModel from "../../models/player";
import styles from './styles.module.scss';

const Score = ({ playerId }) => {
    const score = useSelector(PlayerModel.getPlayerScoreSelector(playerId));

    return (
        <div className={styles.score}>{score}</div>
    );
};

export default Score;