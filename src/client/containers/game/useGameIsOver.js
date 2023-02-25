import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectGameIsOver} from "../../store/selectors/game";
import {selectPlayerIsWinner} from "../../store/selectors/player";

const UseGameIsOver = () => {
    const gameIsOver = useSelector(selectGameIsOver);
    const isWinner = useSelector(selectPlayerIsWinner);

    useEffect(() => {
        if (gameIsOver) {
            if (isWinner) {
                alert('You are won!');
            } else {
                alert('You are loss!');
            }
        }
    }, [gameIsOver]);

};

export default UseGameIsOver;