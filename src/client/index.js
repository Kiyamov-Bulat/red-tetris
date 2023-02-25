import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from "./containers/app.js";
import './styles.scss';

ReactDom.render((
  <Provider store={store}>
    <App message='hi'/>
  </Provider>
), document.getElementById('tetris'));