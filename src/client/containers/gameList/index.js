import React, {useEffect, useRef} from 'react';
import GameListModel from '../../models/gameList';
import store from "../../store";
import {useSelector} from "react-redux";
import {selectGameListState} from "../../store/selectors/gameList";
import GameUnit from "./gameUnit";
import styles from './styles.module.scss';

const UPDATE_TIMEOUT = 10000;

const dispatchUpdateGameList = (dispatch = store.dispatch) => dispatch(GameListModel.get())

const GameList = () => {
    const state = useSelector(selectGameListState);
    const updateInterval = useRef(null);

    useEffect(() => {
        dispatchUpdateGameList();
        updateInterval.current = window.setInterval(dispatchUpdateGameList, UPDATE_TIMEOUT);
        
        return () => {
            window.clearInterval(updateInterval.current);
        };
    }, []);

    return (
        <div className={styles.gameList}>
            {state.map((game) => <GameUnit game={game}/>)}
        </div>
    );
};

export default GameList;