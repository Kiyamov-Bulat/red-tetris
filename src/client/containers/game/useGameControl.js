import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectGameIsStarted} from "../../store/selectors/game";
import {
    moveBottomTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveToPile,
    rotateTetramino,
    updateGameState
} from "../../store/slices/game";
import store from "../../store";

const gameControl = (e) => {
    let action = null;

    switch (e.key) {
        case 'ArrowDown':
            action = moveToPile;
            break;
        case 'ArrowUp':
            action = rotateTetramino;
            break;
        case 'ArrowLeft':
            action = moveLeftTetramino;
            break;
        case 'ArrowRight':
            action = moveRightTetramino;
            break;
        case ' ':
            action = moveBottomTetramino;
            break;
    }
    if (action) {
        store.dispatch(action());
    }
};

const useGameControl = () => {
    const gameIsStarted = useSelector(selectGameIsStarted);

    useEffect(() => {
        if (!gameIsStarted) {
            return;
        }

        document.addEventListener('keydown', gameControl);

        return () => {
            document.removeEventListener('keydown', gameControl);
        };
    }, [gameIsStarted]);
};

export default useGameControl;