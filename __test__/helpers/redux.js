import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import {setupStore} from "../../src/client/store";
import {getGameInitialState} from "../../src/client/store/slices/game";
import {getPlayerInitialState} from "../../src/client/store/slices/player";
import {getGameListInitialState} from "../../src/client/store/slices/gameList";
import * as appStore from "../../src/client/store";

const mutateDefaultStore = (store) => {
    // eslint-disable-next-line no-import-assign
    appStore.default = store;
};

export function renderWithProviders(
    ui,
    {
        preloadedState = getPreloadedState(),
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }

    mutateDefaultStore(store);
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function getPreloadedState() {
    return {
        game: { ...getGameInitialState() },
        player: { ...getPlayerInitialState() },
        gameList: { ...getGameListInitialState()}
    };
}