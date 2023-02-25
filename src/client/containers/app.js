import React, {useEffect} from 'react';
import StartMenu from "./startMenu";
import Game from "./game";
import sessionStorageService from "../services/sessionStorageService";
import GameList from "./gameList";
import styles from './styles.module.scss';
const App = () => {
    useEffect(() => {
        sessionStorageService.setSessionId();
    }, []);

    return (
      <div className={styles.app}>
          <Game/>
          <div className={styles.sidePanel}>
              <GameList/>
              <StartMenu/>
          </div>
      </div>
);
};

export default App;
