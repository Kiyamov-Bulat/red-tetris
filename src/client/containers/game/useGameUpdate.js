import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import {selectGameIsStarted} from "../../store/selectors/game";
import Game from "../../models/game";

export const GAME_UPDATE_TIMEOUT = 500;

const useGameUpdate = () => {
    const gameIsStarted = useSelector(selectGameIsStarted);
    const updateIntervalId = useRef(null);

    useEffect(() => {
        if (!gameIsStarted) {
            return;
        }

        updateIntervalId.current = window.setInterval(() => {
            Game.updateState();
        }, GAME_UPDATE_TIMEOUT);

        return () => {
            window.clearInterval(updateIntervalId.current);
        };
    }, [gameIsStarted]);
};

export default useGameUpdate;