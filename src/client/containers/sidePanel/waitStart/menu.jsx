import React from 'react';
import styles from "./styles.module.scss";
import Button from "../../../components/button/index.jsx";
import {useSelector} from "react-redux";
import {selectCurrentUserIsHost} from "../../../store/selectors/game";
import GameModel from "../../../models/game";
import sessionStorageService from "../../../services/sessionStorageService";

const Menu = () => {
    const currentUserIsHost = useSelector(selectCurrentUserIsHost);

    return (
        <div className={styles.waitStartMenuContainer}>
            <Button onClick={() => GameModel.leave(sessionStorageService.getSessionId())}>Выйти</Button>
            {currentUserIsHost && <Button onClick={() => GameModel.start()}>Начать</Button>}
        </div>
    );
};

export default Menu;