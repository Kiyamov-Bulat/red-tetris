import React from 'react';
import StartMenu from "./startMenu";
import Game from "./game";

const App = ({message}) => {

  return (
      <div>
          <StartMenu/>
          <Game/>
      </div>
  );
};

export default App;
