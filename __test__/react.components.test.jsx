import React from 'react';
import Button from "../src/client/components/button";
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import sessionStorageService from "../src/client/services/sessionStorageService";
import {renderWithProviders} from "./helpers/redux";
import Cube, {CUBE_SIZE} from "../src/client/components/field/cube";
import TetraminoModel, {CUBE_COLOR} from "../src/client/models/tetramino";
import {CUBE_TYPE, FIELD_SIZE, TETRAMINO_TYPE} from "../src/utils/constants";
import {getGameInitialState, updateGameState} from "../src/client/store/slices/game";
import Field from "../src/client/components/field";
import FieldModel from "../src/client/models/field";
import Modal, {MODAL_TEST_ID} from "../src/client/components/modal";
import {LOSE_TITLE, WIN_TITLE} from "../src/client/containers/game/gameOverModal";
import Game from "../src/client/containers/game";
import GameModel from "../src/client/models/game";
import {selectGame} from "../src/client/store/selectors/game";
import {v4 as uuidv4} from "uuid";

const getCubeCSSColor = (type) => `background: ${CUBE_COLOR[type]}`;

const expectFieldSize = (cubes) =>
    expect(cubes.length).toBe(FIELD_SIZE.line * FIELD_SIZE.column);

const expectEmptyField = (children) => {
    expectFieldSize(children);

    children.forEach(
        (cube) => {
            expect(cube).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
        }
    );
};

const getCurrentUser = () => (
    { name: 'Noob', id: sessionStorageService.getSessionId() }
);

const getMockGame = () => {
    const mock = {};

    mock.host = getCurrentUser();
    mock.id = uuidv4();
    mock.createdAt = new Date().toISOString();
    mock.players = [];
    mock.tetraminoQueue = [];
    mock.isStarted = false;
    mock.isOver = false;
    return mock;
};

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
                <Cube column={0} line={0} playerId={sessionStorageService.getSessionId()}/>
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

            expectEmptyField(children);
        });

        it('field with tetramino', async () => {
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

            act(() => {
                // UPDATE
                store.dispatch(updateGameState());
            });

            expect(getCube(center, 0)).toHaveStyle(getCubeCSSColor(CUBE_TYPE.EMPTY));
            testTetramino(1);
        });

        it('mini field', () => {
            const { container } = renderField(false, undefined, 1);
            const cubes = [...container.firstChild.childNodes.values()];
        
            cubes.forEach((cube) => {
                expect(cube).toHaveStyle(`width: ${CUBE_SIZE.MINI}px; height: ${CUBE_SIZE.MINI}px`);
            });
        });
    });

    describe('modal', () => {
       const renderModal = (isOpen, onClose) =>
           renderWithProviders(<Modal onClose={onClose} text={'text'} title={'title'} isOpen={isOpen} className={'foo'}/>);

       it('open modal', async () => {
           let isOpen = true;
           const { container, queryByText } = renderModal(isOpen, () => isOpen = false);
           const modal = container.firstChild;

           expect(queryByText('text')).toBeInTheDocument();
           expect(queryByText('title')).toBeInTheDocument();

           const btn = queryByText('X');

           expect(btn).toBeInTheDocument();

           if (!btn) return;

           fireEvent.click(btn);
           expect(modal).toBeInTheDocument();
       });
       
       it('closed modal', () => {
           const { container } = renderModal(false);

           expect(container.firstChild).toBeNull();
       });
    });

    describe('game', () => {
        const renderGame = () => renderWithProviders(<Game/>);
        const EMPTY_GAME_TYPE = {
            INITIAL: 1,
            WIN: 2,
            LOSE: 3,
        };
        
        const expectClosedModal = (queryByText) => {
            expect(queryByText(WIN_TITLE)).toBeNull();
            expect(queryByText(LOSE_TITLE)).toBeNull();
        };

        const expectWinModal = (queryByText) => {
            expect(queryByText(WIN_TITLE)).toBeInTheDocument();
            expect(queryByText(LOSE_TITLE)).toBeNull();
        };
        
        const expectGameWithEmptyField = (type, data = renderGame()) => {
            const { container, queryByText, store } = data;
            const field = container.lastChild;

            if (type !== EMPTY_GAME_TYPE.INITIAL) {
                act(() => {
                    const loser = type === EMPTY_GAME_TYPE.WIN ? { id: 'bar' } : getCurrentUser();
                    GameModel.onConnect(getMockGame(), store);
                    GameModel.onStart(selectGame(store.getState()), store);
                    GameModel.onFinish(selectGame(store.getState()), loser, store);
                });
            }
            
            switch (type) {
                case EMPTY_GAME_TYPE.INITIAL:
                    expectClosedModal(queryByText);
                    break;
                case EMPTY_GAME_TYPE.WIN:
                    expectWinModal(queryByText);
                    break;
                case EMPTY_GAME_TYPE.LOSE:
                    expect(queryByText(LOSE_TITLE)).toBeInTheDocument();
                    expect(queryByText(WIN_TITLE)).toBeNull();
                    break;
            }

            expect(field).toBeTruthy();
            expectEmptyField([...field.childNodes.values()]);
            return data;
        };
        
        it('initial state of game', () => {
             expectGameWithEmptyField(EMPTY_GAME_TYPE.INITIAL);
        });

        it('lost game', () => {
            const { container, queryByText } = expectGameWithEmptyField(EMPTY_GAME_TYPE.LOSE);

            expect(container.firstChild).toBeTruthy();
            fireEvent.click(container.firstChild);
            expectClosedModal(queryByText);
        });

        it('winning game', () => {
            const { container, queryByText } = expectGameWithEmptyField(EMPTY_GAME_TYPE.WIN);

            expect(container.firstChild).toBeTruthy();
            fireEvent.click(container.firstChild);
            expectClosedModal(queryByText);
        });
        
        it('modal close', () => {
            const {container, queryByText, getByTestId} = expectGameWithEmptyField(EMPTY_GAME_TYPE.WIN);

            // click on modal
            fireEvent.click(getByTestId(MODAL_TEST_ID));
            expectWinModal(queryByText);

            const closeBtn = container.querySelector('button');

            expect(closeBtn).toBeTruthy();
            // click on close btn
            fireEvent.click(closeBtn);
            expectClosedModal(queryByText);
        });
        
        it.skip('single game',  () => {
            const { store, container} = renderGame();
            
            act(() => {
                
            });
        });
    });
});