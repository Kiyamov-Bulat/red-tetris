import React from 'react';
import Button from "../../components/button";
import styles from './styles.module.scss';
import Game from "../../models/game";
import {useDispatch} from "react-redux";
import {setIsSinglePlayerGame, startGame} from "../../store/slices/game";

const StartMenu = () => {
    const dispatch = useDispatch();
    const createMultiplayerGame = async () => {
        dispatch(Game.create());
    };

    const startSinglePlayerGame = () => {
        dispatch(setIsSinglePlayerGame());
        dispatch(startGame());
    };

    return (
        <div className={styles.startMenuContainer}>
            <Button onClick={startSinglePlayerGame}>Одиночная</Button>
            <Button onClick={createMultiplayerGame}>С противником</Button>
        </div>
    );
};

export default StartMenu;