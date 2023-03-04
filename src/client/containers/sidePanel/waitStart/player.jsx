import React from 'react';
import styles from './styles.module.scss';
import {useSelector} from "react-redux";
import {selectCurrentUserIsHost, selectGameHost} from "../../../store/selectors/game";
import Button from "../../../components/button/index.jsx";
import sessionStorageService from "../../../services/sessionStorageService";
import GameModel from "../../../models/game";

export const PLAYER_UNIT_TEST_ID = 'player-unit';

const Player = ({ state, index }) => {
    const currentUserIsHost = useSelector(selectCurrentUserIsHost);
    const host = useSelector(selectGameHost);

    return (
        <div data-testid={PLAYER_UNIT_TEST_ID} className={styles.player}>
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