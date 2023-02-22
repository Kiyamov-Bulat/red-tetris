import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/app';
import store from "./store";

ReactDom.render((
  <Provider store={store}>
    <App message='hi'/>
  </Provider>
), document.getElementById('tetris'));