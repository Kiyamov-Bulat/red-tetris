import React from 'react';
import styles from './styles.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUserIsHost} from "../../../store/selectors/game";
import Button from "../../../components/button";
import sessionStorageService from "../../../services/sessionStorageService";
import GameModel from "../../../models/game";

const Player = ({ state, index }) => {
    const currentUserIsHost = useSelector(selectCurrentUserIsHost);

    return (
        <div className={styles.player}>
            <p>{index}.</p>
            <p className={styles.name}>{state.name || state.id || 'unknown user'}</p>
            {currentUserIsHost && state.id !== sessionStorageService.getSessionId() &&
                <Button onClick={() => GameModel.kick(state.id)} className={styles.kickBtn}>Кикнуть</Button>
            }
        </div>
    );
};

export default Player;