import React from 'react';
import Button from "../../components/button";
import styles from './styles.module.scss';
const StartMenu = () => {
    return (
        <div className={styles.startMenuContainer}>
            <p>welcome to the wonderful world</p>
            <div>
                <Button>123</Button>
            </div>
        </div>
    );
};

export default StartMenu;