import React from 'react';
import StartMenu from "../startMenu";
import GameList from "../gameList";
import styles from './styles.module.scss';

const SidePanel = () => {

    return (
        <div className={styles.sidePanel}>
            <StartMenu/>
            <GameList/>
        </div>
    );
};

export default SidePanel;