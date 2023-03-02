import React from 'react';
import {useSelector} from "react-redux";
import {selectOpponentsFields} from "../../../store/selectors/game";
import Field from "../../../components/field";

const Fields = () => {
    const opponentsFields = useSelector(selectOpponentsFields);

    return (
        <>
            {opponentsFields.map(({ field, playerId }, idx) => {

                return <Field key={idx} playerId={playerId} state={field}/>;
            })}
        </>
    );
};

export default Fields;