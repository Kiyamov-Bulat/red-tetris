import React from 'react';
import styles from './styles.module.scss';

const Player = ({ state, index }) => {
    return (
        <div className={styles.player}>
            <p>{index}.</p>
            <p className={styles.name}>{state.name || state.id || 'unknown user'}</p>
        </div>
    );
};

export default Player;