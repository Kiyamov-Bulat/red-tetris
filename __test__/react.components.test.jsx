import React from 'react';
import Button from "../src/client/components/button";
import {fireEvent, render, waitFor} from "@testing-library/react";
import sessionStorageService from "../src/client/services/sessionStorageService";
import {renderWithProviders} from "./helpers/redux";
import Cube, {CUBE_SIZE} from "../src/client/components/field/cube";
import TetraminoModel, {CUBE_COLOR} from "../src/client/models/tetramino";
import {CUBE_TYPE, FIELD_SIZE, TETRAMINO_TYPE} from "../src/utils/constants";
import {getGameInitialState, updateGameState} from "../src/client/store/slices/game";
import Field from "../src/client/components/field";
import FieldModel from "../src/client/models/field";

const getCubeCSSColor = (type) => `background: ${CUBE_COLOR[type]}`;

describe('components', () => {
    beforeAll(() => {
        sessionStorageService.setSessionId();
        // jest.useFakeTimers();
    });

    it('Button', () => {
        let res = 0;

        const {getByText} = render(
            <Button className={'button'} onClick={() => res = 1}>123</Button>,
        );

        const button = getByText(/123/i);

        fireEvent.click(button);
        expect(button.classList.contains('button')).toBe(true);
        expect(res).toBe(1);
    });

    describe('cube', () => {
        it('Empty cube', () => {
            const { container } = renderWithProviders(
                <Cube column={0} line={0} playerId={sessionStorageService.getSessionId()}/>,
                {
                    preloadedState: {
                        game: { ...getGameInitialState() }
                    }
                }
            );

            expect(container.firstChild).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
        });
    });
    
    describe('field', () => {
        const renderField = (
            generateTetramino = false,
            type = TETRAMINO_TYPE.I,
            playerId = sessionStorageService.getSessionId()
        ) => {
            return renderWithProviders(
                <Field state={FieldModel.getEmpty()} playerId={playerId}/>,
                {
                    preloadedState: {
                        game: {
                            ...getGameInitialState(),
                            currentTetramino: generateTetramino
                                ? TetraminoModel.generate(type)
                                : undefined,
                        }
                    }
                }
            );
        };

        it('empty field', () => {
            const { container } = renderField();
            const children = [...container.firstChild.childNodes.values()];

            expect(container.firstChild.childNodes.length).toBe(FIELD_SIZE.line * FIELD_SIZE.column);

            children.forEach(
                (cube) => {
                    expect(cube).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
                });
        });

        it ('field with tetramino', async () => {
            const { container, store } = renderField(true);
            const cubes = [...container.firstChild.childNodes.values()];
            const center = 4;
            const size = 4;
            const getCube = (column, line) => cubes[column + line * FIELD_SIZE.column];
            const testTetramino = (line) => {
                for (let i = line; i < size; ++i) {
                    expect(getCube(center, i)).toHaveStyle(getCubeCSSColor(CUBE_TYPE.I));
                }
                expect(getCube(center - 1, line)).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
                expect(getCube(center + 1, line)).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
            };

            testTetramino(0);
            // UPDATE
            store.dispatch(updateGameState());

            await waitFor(() => {
                expect(getCube(center, 0)).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
                testTetramino(1);
            });
        });

        it('mini field', () => {
            const { container } = renderField(false, undefined, 1);
            const cubes = [...container.firstChild.childNodes.values()];
        
            cubes.forEach((cube) => {
                expect(cube).toHaveStyle(`width: ${CUBE_SIZE.MINI}px; height: ${CUBE_SIZE.MINI}px`);
            });
        });
    });
});