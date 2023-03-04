import React, {useEffect, useState} from 'react';
import Modal from "../../components/modal";
import {useSelector} from "react-redux";
import {selectGameIsOver, selectGameIsStarted} from "../../store/selectors/game";
import {selectPlayerIsWinner} from "../../store/selectors/player";

export const WIN_TITLE = 'Поздравляем! Вы выиграли!';
export const LOSE_TITLE = 'К сожалению, вы проиграли';

const GameOverModal = () => {
    const gameIsOver = useSelector(selectGameIsOver);
    const gameIsStarted = useSelector(selectGameIsStarted);
    const isWinner = useSelector(selectPlayerIsWinner);
    const text = isWinner ? WIN_TITLE : LOSE_TITLE;
    const[isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (gameIsStarted) {
            setIsOpen(false);
        } else if (gameIsOver) {
            setIsOpen(true);
        }
    }, [gameIsOver, gameIsStarted]);

    return (
        <Modal isOpen={isOpen} title={text} onClose={() => setIsOpen(false)}>
            Игра окончена!
        </Modal>
    );
};

export default GameOverModal;