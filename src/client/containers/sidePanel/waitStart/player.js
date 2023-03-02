import React from 'react';
import styles from './styles.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUserIsHost, selectGameHost} from "../../../store/selectors/game";
import Button from "../../../components/button";
import sessionStorageService from "../../../services/sessionStorageService";
import GameModel from "../../../models/game";

const Player = ({ state, index }) => {
    const currentUserIsHost = useSelector(selectCurrentUserIsHost);
    const host = useSelector(selectGameHost);

    return (
        <div className={styles.player}>
            <p>{index}.</p>
            <p className={styles.name}>{state.name || state.id || 'unknown user'}</p>
            {currentUserIsHost && state.id !== sessionStorageService.getSessionId() &&
                <Button onClick={() => GameModel.kick(state.id)} className={styles.kickBtn}>Кикнуть</Button>
            }
            {host.id === state.id && <p>⭐</p>}
            {state.id === sessionStorageService.getSessionId() && <p>✔️</p>}
        </div>
    );
};

export default Player;