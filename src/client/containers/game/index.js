import React from 'react';
import Field from "../../components/field";
import {useSelector} from "react-redux";
import {selectField} from "../../store/selectors/game";
import useGameUpdate from "./useGameUpdate";
import useGameControl from "./useGameControl";
import GameOverModal from "./gameOverModal";

const Game = () => {
    const fieldState = useSelector(selectField);

    useGameControl();
    useGameUpdate();

    return (
        <>
            <GameOverModal/>
            <Field state={fieldState}/>
        </>
    );
};

export default Game;