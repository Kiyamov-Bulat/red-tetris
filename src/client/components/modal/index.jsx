import React from 'react';
import cx from "classnames";
import styles from './styles.module.scss';

export const MODAL_TEST_ID = 'modal';

const Modal = ({ isOpen, title, text, className, onClose, children }) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div data-testid={MODAL_TEST_ID} className={cx(styles.modalWrapper, className)} onClick={onClose}>
            <div className={styles.modal}>
                <h1>{title}</h1>
                <p>{text || children}</p>
            </div>
        </div>
    );
};

export default Modal;