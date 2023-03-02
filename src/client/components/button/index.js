import React from 'react';
import styles from './styles.module.scss';
import cx from 'classnames';

const Button = ({ onClick, className, children }) => {
    return (
        <button onClick={onClick} className={cx(styles.button, className)}>
            {children}
        </button>
    );
};

export default Button;