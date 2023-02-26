import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useRef} from 'react';
import GameListModel from '../../models/gameList';
import store from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {selectGameListState} from "../../store/selectors/gameList";
import GameUnit from "./gameUnit";
import styles from './styles.module.scss';

const dispatchUpdateGameList = (dispatch = store.dispatch) => dispatch(GameListModel.get());

const GameList = () => {
    const state = useSelector(selectGameListState);

    useEffect(() => {
        dispatchUpdateGameList();
        GameListModel.listenUpdates();

        return GameListModel.removeUpdatesListener;
    }, []);

    return (
        <div className={styles.gameList}>
            {[{ id: uuidv4(), host: {}, createdAt: new Date().toISOString()}].map((game, idx) =>
                <GameUnit key={game.id} game={game} index={idx + 1}/>)}
        </div>
    );
};

export default GameList;