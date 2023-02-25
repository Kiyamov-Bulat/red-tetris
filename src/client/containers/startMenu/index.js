import React from 'react';
import Button from "../../components/button";
import styles from './styles.module.scss';
import Game from "../../models/game";
import store from "../../store";
const StartMenu = () => {
    const createMultiplayerGame = async () => {
        store.dispatch(Game.create());
    };

    return (
        <div className={styles.startMenuContainer}>
            <Button onClick={createMultiplayerGame}>Одиночная</Button>
            <Button onClick={createMultiplayerGame}>С противником</Button>
        </div>
    );
};

export default StartMenu;