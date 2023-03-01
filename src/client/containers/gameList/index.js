import React, {useEffect} from 'react';
import GameListModel from '../../models/gameList';
import store from "../../store";
import {useSelector} from "react-redux";
import {selectGameListState} from "../../store/selectors/gameList";
import GameUnit from "./gameUnit";
import styles from './styles.module.scss';

const dispatchUpdateGameList = (dispatch = store.dispatch) => dispatch(GameListModel.get());

const GameList = () => {
    const state = useSelector(selectGameListState);

    console.log(state)
    useEffect(() => {
        dispatchUpdateGameList();
        GameListModel.listenUpdates();

        return GameListModel.removeUpdatesListener;
    }, []);

    return (
        <div className={styles.gameList}>
            {state.map((game, idx) =>
                <GameUnit key={game.id} game={game} index={idx + 1}/>)}
        </div>
    );
};

export default GameList;