import React from 'react';
import Button from "../src/client/components/button";
import {fireEvent} from "@testing-library/react";
import {renderWithProviders} from "./helpers/redux";
import Cube from "../src/client/components/field/cube";
import sessionStorageService from "../src/client/services/sessionStorageService";
import {CUBE_COLOR} from "../src/client/models/tetramino";
import {CUBE_TYPE} from "../src/utils/constants";
import FieldModel from "../src/client/models/field";
import {getGameInitialState} from "../src/client/store/slices/game";

describe('components', () => {
    beforeAll(() => {
        sessionStorageService.setSessionId();
    });

    it('Button', () => {
        let res = 0;

        const {getByText} = renderWithProviders(
            <Button className={'button'} onClick={() => res = 1}>123</Button>,
        );

        const button = getByText(/123/i);

        fireEvent.click(button);
        expect(button.classList.contains('button')).toBe(true);
        expect(res).toBe(1);
    });

    describe('cubes', () => {
        it('Empty cube', () => {
            const { container } = renderWithProviders(
                <Cube column={0} line={0} playerId={sessionStorageService.getSessionId()}/>,
                {
                    preloadedState: {
                        game: { ...getGameInitialState() }
                    }
                }
            );

            console.log(container.firstChild.style);
            expect(container.firstChild.style.backgroundColor).toBe(CUBE_COLOR[CUBE_TYPE.EMPTY]);
        });
    });

});