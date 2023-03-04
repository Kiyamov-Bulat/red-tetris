import React from 'react';
import cx from "classnames";
import styles from './styles.module.scss';
import Button from "../button/index.jsx";
const Modal = ({ isOpen, title, text, className, onClose, children }) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className={cx(styles.modalWrapper, className)} onClick={onClose}>
            <div className={styles.modal}>
                <h1>{title}</h1>
                <p>{text || children}</p>
                <Button onClick={onClose} className={styles.closeBtn}>X</Button>
            </div>
        </div>
    );
};

export default Modal;