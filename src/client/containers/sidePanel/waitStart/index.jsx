import React from 'react';
import {useSelector} from "react-redux";
import {selectPlayers} from "../../../store/selectors/game";
import Player from "./player";
import Menu from "./menu";
import styles from './styles.module.scss';

export const WAIT_START_SIDE_PANEL_TITLE = 'Игроки подключившиеся к игре:';

const WaitStart = () => {
    const players = useSelector(selectPlayers);

    return (
        <>
            <Menu/>
            <h1>{WAIT_START_SIDE_PANEL_TITLE}</h1>
            <div className={styles.playerList}>
                {players.map((player, idx) =>
                    <Player key={player.id} index={idx + 1} state={player}/>)
                }
            </div>
        </>
    );
};

export default WaitStart;