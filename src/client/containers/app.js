import React from 'react';
import StartMenu from "./startMenu";
import Field from "../components/field";
import {useSelector} from "react-redux";
import {selectField} from "../store/selectors/field";

const App = ({message}) => {
  const fieldState = useSelector(selectField);

  return (
      <div>
        <StartMenu/>
        <Field state={fieldState}/>
      </div>
  );
};

export default App;
