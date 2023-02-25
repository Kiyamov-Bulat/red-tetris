import React from 'react';
import {useSelector} from "react-redux";
import {selectOpponentsFields} from "../../../store/selectors/game";
import Field from "../../../components/field";

const Fields = () => {
    const opponentsFields = useSelector(selectOpponentsFields);

    return (
        <>
            {opponentsFields.map((field) => <Field state={field}/>)}
        </>
    );
};

export default Fields;