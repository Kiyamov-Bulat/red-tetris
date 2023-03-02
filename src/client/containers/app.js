import React, {useEffect} from 'react';
import Game from "./game";
import sessionStorageService from "../services/sessionStorageService";
import styles from './styles.module.scss';
import SidePanel from "./sidePanel";
import GameModel from "../models/game";

const App = () => {
    useEffect(() => {
        sessionStorageService.setSessionId();

        return GameModel.clear;
    }, []);

    return (
      <div className={styles.app}>
          <Game/>
          <SidePanel/>
      </div>
);
};

export default App;
