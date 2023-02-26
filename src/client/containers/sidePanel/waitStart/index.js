import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentUserIsHost, selectPlayers} from "../../../store/selectors/game";
import Player from "./player";
import Menu from "./menu";

const WaitStart = () => {
    const players = useSelector(selectPlayers);

    return (
        <>
            <Menu/>
            <h1>Игроки подключившиеся к игре:</h1>
            <div>
                {players.map((player) => <Player state={player}/>)}
            </div>
        </>
    );
};

export default WaitStart;