import React from 'react';
import Button from "../../../components/button";
import styles from './styles.module.scss';
import Game from "../../../models/game";

const StartMenu = () => {

    return (
        <div className={styles.startMenuContainer}>
            <Button onClick={() => Game.create(true)}>Одиночная</Button>
            <Button onClick={() => Game.create(false)}>С противником</Button>
        </div>
    );
};

export default StartMenu;