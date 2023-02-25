import React from 'react';
import styles from "./styles.module.scss";
import Button from "../../../components/button";
import {useSelector} from "react-redux";
import {selectCurrentUserIsHost} from "../../../store/selectors/game";

const Menu = () => {
    const currentUserIsHost = useSelector(selectCurrentUserIsHost);

    return (
        <div className={styles.waitStartMenuContainer}>
            <Button>Выйти</Button>
            {currentUserIsHost && <Button>Начать</Button>}
        </div>
    );
};

export default Menu;