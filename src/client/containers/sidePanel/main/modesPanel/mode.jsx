import React from 'react';
import cx from 'classnames';
import GameModel from "../../../../models/game";
import styles from './styles.module.scss';

const Mode = ({ value, isSelected }) => {

    return (
        <p className={cx({ [styles.selected]: isSelected })}
           onClick={() => GameModel.setMode(value)}
        >
            {value}
        </p>);
};

export default Mode;