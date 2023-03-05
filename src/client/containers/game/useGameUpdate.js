import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectGameIsStarted} from "../../store/selectors/game";
import {updateGameState} from "../../store/slices/game";

export const GAME_UPDATE_TIMEOUT = 500;

const useGameUpdate = () => {
    const dispatch = useDispatch();
    const gameIsStarted = useSelector(selectGameIsStarted);
    const updateIntervalId = useRef(null);

    useEffect(() => {
        if (!gameIsStarted) {
            return;
        }

        updateIntervalId.current = window.setInterval(() => {
            dispatch(updateGameState());
        }, GAME_UPDATE_TIMEOUT);

        return () => {
            window.clearInterval(updateIntervalId.current);
        };
    }, [gameIsStarted]);
};

export default useGameUpdate;