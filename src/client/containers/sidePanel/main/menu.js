import React from 'react';
import Button from "../../../components/button";
import styles from './styles.module.scss';
import GameModel from "../../../models/game";

const StartMenu = () => {

    return (
        <div className={styles.startMenuContainer}>
            <Button onClick={() => GameModel.create(true)}>Одиночная</Button>
            <Button onClick={() => GameModel.create(false)}>С противником</Button>
        </div>
    );
};

export default StartMenu;