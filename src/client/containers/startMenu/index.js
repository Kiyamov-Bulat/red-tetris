import React from 'react';
import Button from "../../components/button";
import styles from './styles.module.scss';
import jsonFetch from "../../services/fetch";
const StartMenu = () => {
    const createMultiplayerGame = async () => {
        const resp = await jsonFetch('/1/1', 'POST');

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