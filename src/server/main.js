import params from '../../params';
import * as server from './index';
import startApp from "./app";


// server.create(params.server).then( () => console.log('not yet ready to play tetris with U ...') );

startApp(params.server);