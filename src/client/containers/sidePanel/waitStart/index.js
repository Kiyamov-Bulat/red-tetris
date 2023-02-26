import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentUserIsHost, selectPlayers} from "../../../store/selectors/game";
import Player from "./player";
import Menu from "./menu";
import styles from './styles.module.scss';

const WaitStart = () => {
    const players = useSelector(selectPlayers);

    return (
        <>
            <Menu/>
            <h1>Игроки подключившиеся к игре:</h1>
            <div className={styles.playerList}>
                {players.map((player, idx) =>
                    <Player key={player.id} index={idx + 1} state={player}/>)
                }
            </div>
        </>
    );
};

export default WaitStart;