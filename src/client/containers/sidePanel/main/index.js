import React from 'react';
import StartMenu from "../../startMenu";
import GameList from "../../gameList";

const Main = () => {

    return (
        <>
            <StartMenu/>
            <h1>Доступные игры:</h1>
            <GameList/>
        </>
    );
};

export default Main;