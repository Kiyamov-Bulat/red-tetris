import React from 'react';
import {useSelector} from "react-redux";
import {selectOpponentsFields} from "../../../store/selectors/game";
import Field from "../../../components/field";
import styles from './styles.module.scss';

const Fields = () => {
    const opponentsFields = useSelector(selectOpponentsFields);

    return (
        <div className={styles.fields}>
            <h1>Поля опонентов</h1>
            {opponentsFields.map(({ field, player }) => {

                return (
                    <div key={player.id}>
                        <p className={styles.name}>{player.name}</p>
                        <Field playerId={player.id} state={field}/>
                    </div>
                );
            })}
        </div>
    );
};

export default Fields;