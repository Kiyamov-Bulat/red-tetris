import React from 'react';
import StartMenu from "./menu";
import GameList from "../../gameList";
import ModesPanel from "./modesPanel";

export const MAIN_SIDE_PANEL_TITLE = 'Доступные игры:';

const Main = () => {

    return (
        <>
            <StartMenu/>
            <h1>{MAIN_SIDE_PANEL_TITLE}</h1>
            <GameList/>
            <ModesPanel/>
        </>
    );
};

export default Main;