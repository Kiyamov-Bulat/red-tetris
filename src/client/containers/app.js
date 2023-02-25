import React, {useEffect} from 'react';
import StartMenu from "./startMenu";
import Game from "./game";
import sessionStorageService from "../services/sessionStorageService";

const App = () => {
    useEffect(() => {
        sessionStorageService.setSessionId();
    }, []);

    return (
      <div>
          <StartMenu/>
          <Game/>
      </div>
);
};

export default App;
