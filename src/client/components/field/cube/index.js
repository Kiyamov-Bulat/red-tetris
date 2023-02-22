import React from 'react';
import styles from './styles.module.scss';

const Cube = ({ line, column, state }) => {

    return (
        <div style={{ background: state.color }} className={styles.cube}></div>
    );
};

export default Cube;