import React, {useEffect} from 'react';
import Game from "./game";
import sessionStorageService from "../services/sessionStorageService";
import styles from './styles.module.scss';
import SidePanel from "./sidePanel";

const App = () => {
    useEffect(() => {
        sessionStorageService.setSessionId();
    }, []);

    return (
      <div className={styles.app}>
          <Game/>
          <SidePanel/>
      </div>
);
};

export default App;
