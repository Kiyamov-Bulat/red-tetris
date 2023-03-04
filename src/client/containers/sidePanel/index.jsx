import React from 'react';
import {SIDE_PANEL_TYPE} from "../../models/game";
import Main from "./main";
import WaitStart from "./waitStart";
import {useSelector} from "react-redux";
import {selectSidePanelType} from "../../store/selectors/game";
import styles from './styles.module.scss';
import Fields from "./fields";

const SIDE_PANELS = {
    [SIDE_PANEL_TYPE.MAIN]: Main,
    [SIDE_PANEL_TYPE.WAIT_START]: WaitStart,
    [SIDE_PANEL_TYPE.FIELDS]: Fields,
};

const SidePanel = () => {
    const Panel = SIDE_PANELS[useSelector(selectSidePanelType)];

    return (
        <div className={styles.sidePanel}>
            <Panel/>
        </div>
    );
};

export default SidePanel;