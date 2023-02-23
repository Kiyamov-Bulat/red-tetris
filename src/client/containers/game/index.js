import React, {useEffect} from 'react';
import Field from "../../components/field";
import {useDispatch, useSelector} from "react-redux";
import {selectField} from "../../store/selectors/game";
import {
    moveBottomTetramino,
    moveLeftTetramino,
    moveRightTetramino, moveToPile,
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

const Game = () => {
    const dispatch = useDispatch();
    const fieldState = useSelector(selectField);

    useEffect(() => {
        setInterval(() => {
            dispatch(updateGameState());
        }, 500);

        document.addEventListener('keydown', gameControl);

        return () => {
            document.removeEventListener('keydown', gameControl);
        };
    }, []);

    return (
        <Field state={fieldState}/>
    );
};

export default Game;