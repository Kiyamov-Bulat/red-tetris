import React from 'react';
import Cube from "../cube";
import styles from './styles.module.scss';

const Line = ({ index, cubes }) => {

    return (
        <div className={styles.line}>
            {cubes.map((cube, idx) => <Cube key={idx} column={idx} line={index} state={cube}/>)}
        </div>
    );
};

export default Line;