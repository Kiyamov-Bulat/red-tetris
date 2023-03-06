import React from 'react';
import {GAME_MODE} from "../../../../../utils/constants";
import styles from './styles.module.scss';
import {useSelector} from "react-redux";
import {selectGameMode} from "../../../../store/selectors/game";
import Mode from "./mode";

const ModesPanel = () => {
    const selectedMode = useSelector(selectGameMode);

    console.log(selectedMode);
    return (
        <div className={styles.modes}>
            {Object.values(GAME_MODE).map((mode) =>
                <Mode key={mode} isSelected={selectedMode === mode} value={mode}/>)}
        </div>
    );
};

export default ModesPanel;