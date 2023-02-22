import React from 'react';
import styles from './styles.module.scss';
import cx from 'classnames';

const Button = ({ onClick, className, children }) => {
    return (
        <button onClick={onClick} className={cx(className, styles.button)}>
            {children}
        </button>
    );
};

export default Button;