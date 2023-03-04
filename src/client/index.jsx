import React from 'react';
import ReactDom from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from "./containers/app.jsx";
import './styles.scss';

const root = ReactDom.createRoot(document.getElementById("tetris"));

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
