import React, {useEffect, useRef} from 'react';
import Field from "../../components/field";
import {useDispatch, useSelector} from "react-redux";
import {selectField, selectGameIsOver} from "../../store/selectors/game";
import {
    moveBottomTetramino,
    moveLeftTetramino,
    moveRightTetramino,
    moveToPile,
    rotateTetramino,
    updateGameState
} from "../../store/slices/game";
import store from "../../store";
import {selectPlayerIsWinner} from "../../store/selectors/player";

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

const Game = () => {
    const dispatch = useDispatch();
    const fieldState = useSelector(selectField);
    const gameIsOver = useSelector(selectGameIsOver);
    const updateIntervalId = useRef(null);
    const isWinner = useSelector(selectPlayerIsWinner);

    useEffect(() => {
        // updateIntervalId.current = window.setInterval(() => {
        //     dispatch(updateGameState());
        // }, 500);

        document.addEventListener('keydown', gameControl);

        return () => {
            window.clearInterval(updateIntervalId.current);
            document.removeEventListener('keydown', gameControl);
        };
    }, []);

    useEffect(() => {
        if (gameIsOver) {
            if (isWinner) {
                alert('You are won!');
            } else {
                alert('You are loss!');
            }
            window.clearInterval(updateIntervalId.current);
        }
    }, [gameIsOver]);

    return (
        <Field state={fieldState}/>
    );
};

export default Game;