import React, {useEffect, useState} from 'react';
import Modal from "../../components/modal";
import {useSelector} from "react-redux";
import {selectGameIsOver} from "../../store/selectors/game";
import {selectPlayerIsWinner} from "../../store/selectors/player";

const GameOverModal = () => {
    const gameIsOver = useSelector(selectGameIsOver);
    const isWinner = useSelector(selectPlayerIsWinner);
    const text = isWinner ? 'Поздравляем! Вы выиграли!' : 'К сожалению, вы проиграли' ;
    const[isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (gameIsOver) {
            setIsOpen(true);
        }
    }, [gameIsOver]);

    return (
        <Modal isOpen={isOpen} title={text} onClose={() => setIsOpen(false)}>
            Игра окончена!
        </Modal>
    );
};

export default GameOverModal;