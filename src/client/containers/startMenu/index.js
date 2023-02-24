import React from 'react';
import Button from "../../components/button";
import styles from './styles.module.scss';
import jsonFetch from "../../services/fetch";
import { io } from "socket.io-client";

const StartMenu = () => {
    const createMultiplayerGame = async () => {
        const resp = await jsonFetch('/create', 'POST', { body: { playerId: 1 } });

        const socket = io();
        console.log(resp);
    };

    return (
        <div className={styles.startMenuContainer}>
            <p>Menu</p>
            <div>
                <Button onClick={createMultiplayerGame}>Multiplayer</Button>
            </div>
        </div>
    );
};

export default StartMenu;