import React from 'react';
import Button from "../../../components/button/index.jsx";
import styles from './styles.module.scss';
import GameModel from "../../../models/game";
import {useSelector} from "react-redux";
import {selectGameIsStarted} from "../../../store/selectors/game";

const StartMenu = () => {
    const gameIsStarted = useSelector(selectGameIsStarted);

    const createOrClearSinglePlayerGame = () => {
        if (gameIsStarted) {
            GameModel.clear();
        } else {
            GameModel.create(true);
        }
    };

    return (
        <div className={styles.startMenuContainer}>
            <Button onClick={createOrClearSinglePlayerGame}>
                {gameIsStarted ? 'Завершить' : 'Одиночная' }
            </Button>
            <Button onClick={() => GameModel.create(false)}>
                С противником
            </Button>
        </div>
    );
};

export default StartMenu;