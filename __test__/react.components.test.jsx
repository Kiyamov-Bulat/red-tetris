import React from 'react';
import Button from "../src/client/components/button";
import {act, fireEvent, render} from "@testing-library/react";
import sessionStorageService from "../src/client/services/sessionStorageService";
import {renderWithProviders} from "./helpers/redux";
import Cube, {CUBE_SIZE} from "../src/client/components/field/cube";
import TetraminoModel, {CUBE_COLOR} from "../src/client/models/tetramino";
import {CUBE_TYPE, FIELD_SIZE, INITIAL_TETRAMINO_POSITION, TETRAMINO_TYPE} from "../src/utils/constants";
import {getGameInitialState, updateGameState} from "../src/client/store/slices/game";
import Field from "../src/client/components/field";
import FieldModel from "../src/client/models/field";
import Modal from "../src/client/components/modal";
import {LOSE_TITLE, WIN_TITLE} from "../src/client/containers/game/gameOverModal";
import Game from "../src/client/containers/game";
import GameModel from "../src/client/models/game";
import {selectGame} from "../src/client/store/selectors/game";
import App from "../src/client/containers/app";
import {MAIN_SIDE_PANEL_TITLE} from "../src/client/containers/sidePanel/main";
import {WAIT_START_SIDE_PANEL_TITLE} from "../src/client/containers/sidePanel/waitStart";
import {FIELDS_SIDE_PANEL_TITLE} from "../src/client/containers/sidePanel/fields";
import GameList from "../src/client/models/gameList";
import {GAME_UNIT_TEST_ID} from "../src/client/containers/gameList/gameUnit";
import {PLAYER_UNIT_TEST_ID} from "../src/client/containers/sidePanel/waitStart/player";
import {getCurrentUser, getMockGame, getMockPlayer} from "./helpers/game";

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
            TetraminoModel.setGenerateType(type);

            const data = renderWithProviders(
                <Field state={FieldModel.getEmpty()} playerId={playerId}/>,
                {
                    preloadedState: {
                        game: {
                            ...getGameInitialState(),
                            currentTetramino: generateTetramino
                                ? TetraminoModel.generate()
                                : undefined,
                        }
                    }
                });

            TetraminoModel.setGenerateType(null);
            return data;
        };

        it('empty field', () => {
            const { container } = renderField();
            const children = [...container.firstChild.childNodes.values()];

            expectEmptyField(children);
        });

        it('field with tetramino', async () => {
            const { container, store } = renderField(true);
            const cubes = [...container.firstChild.childNodes.values()];
            const center = INITIAL_TETRAMINO_POSITION.column;
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

           fireEvent.click(modal);
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
                    GameModel.onConnect(getMockGame());
                    GameModel.onStart(selectGame(store.getState()));
                    GameModel.onFinish(selectGame(store.getState()), loser);
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
    });
    
    describe('side panel', () => {
        const renderApp = () => renderWithProviders(<App/>);
        const actCreateGame = (game, players) => {
            act(() => {
                game.host = players[0];
                game.players = [...players];
                game.isStarted = true;
                game.isOver = false;
                GameModel.onCreate(game);
            });
        };

        it('initial side panel', () => {
            const { queryByText, queryByTestId } = renderApp();

            expect(queryByTestId(GAME_UNIT_TEST_ID)).toBeNull();
            expect(queryByText(MAIN_SIDE_PANEL_TITLE)).toBeInTheDocument();
            expect(queryByText(WAIT_START_SIDE_PANEL_TITLE)).toBeNull();
            expect(queryByText(FIELDS_SIDE_PANEL_TITLE)).toBeNull();

            expect(queryByText('Одиночная')).toBeInTheDocument();
            expect(queryByText('С противником')).toBeInTheDocument();
        });
        
        it('main side panel with games', () => {
            const { queryAllByTestId, queryByTestId } = renderApp();
            const games = [];
            const expectAddOrRemoveGame = (n, add = true) => {
                act(() => {
                    let game;
                    const action = add ? GameList._addGame : GameList._removeGame;

                    if (add) {
                        game = getMockGame();

                        games.push(game);
                    } else {
                        game = games.pop();
                    }

                    action(game);
                });

                expect(queryAllByTestId(GAME_UNIT_TEST_ID)).toHaveLength(n);
            };

            expect(queryByTestId(GAME_UNIT_TEST_ID)).toBeNull();
            expectAddOrRemoveGame(1);
            expectAddOrRemoveGame(2);
            expectAddOrRemoveGame(3);
            expectAddOrRemoveGame(4);
            expectAddOrRemoveGame(3, false);
            expectAddOrRemoveGame(4);
            expectAddOrRemoveGame(3, false);
            expectAddOrRemoveGame(2, false);
            expectAddOrRemoveGame(1, false);
            expectAddOrRemoveGame(0, false);
            expectAddOrRemoveGame(0, false);
        });

        it('wait start panel - initial - host', () => {
            const { queryByText, queryAllByTestId } = renderApp();
            const game = getMockGame();
            const players = [getCurrentUser()];

            actCreateGame(game, players);

            expect(queryByText(MAIN_SIDE_PANEL_TITLE)).toBeNull();
            expect(queryByText(WAIT_START_SIDE_PANEL_TITLE)).toBeInTheDocument();
            expect(queryByText(FIELDS_SIDE_PANEL_TITLE)).toBeNull();
            expect(queryAllByTestId(PLAYER_UNIT_TEST_ID)).toHaveLength(1);

            expect(queryByText('Выйти')).toBeInTheDocument();
            expect(queryByText('Начать')).toBeInTheDocument();
            expect(queryByText('⭐')).toBeInTheDocument();
            expect(queryByText('✔️')).toBeInTheDocument();
        });

        it('wait start panel - initial - player', () => {
            const { queryAllByText, queryByText, queryAllByTestId } = renderApp();
            const game = getMockGame();
            const players = [getCurrentUser()];

            actCreateGame(game, players);
            
            act(() => {
                const newHost = getMockPlayer();

                players.push(newHost);
                game.players = [...players];
                game.host = newHost;

                GameModel.onConnect(game);
            });

            expect(queryAllByTestId(PLAYER_UNIT_TEST_ID)).toHaveLength(2);
            expect(queryByText('Выйти')).toBeInTheDocument();
            expect(queryByText('Начать')).toBeNull();
            expect(queryAllByText('⭐')).toHaveLength(1);
            expect(queryAllByText('✔️')).toHaveLength(1);
        });

        it('waitStart with players', () => {
            const { queryAllByTestId, queryAllByText, queryByTestId, queryByText } = renderApp();
            const players = [getCurrentUser()];
            const game = getMockGame();

            actCreateGame(game, players);

            const expectPlayers = (n, add = true) => {
                let player;

                act(() => {
                    if (add) {
                        player = getMockPlayer();

                        players.push(player);
                        game.players = [...players];

                        GameModel.onConnect(game);
                    } else {
                        player = players.pop();
                        game.players = [...players];

                        GameModel.onKick(game, player.id);
                    }

                });
                expect(queryAllByTestId(PLAYER_UNIT_TEST_ID)).toHaveLength(n);
            };

            expect(queryAllByTestId(PLAYER_UNIT_TEST_ID)).toHaveLength(1);
            expectPlayers(2);
            expect(queryAllByText('Кикнуть')).toHaveLength(1);
            expectPlayers(3);
            expect(queryAllByText('Кикнуть')).toHaveLength(2);
            expectPlayers(4);
            expectPlayers(5);
            expectPlayers(4, false);
            expectPlayers(5);
            expectPlayers(4, false);
            expectPlayers(3, false);
            expectPlayers(2, false);
            expectPlayers(1, false);
            expectPlayers(0, false);
            expect(queryByTestId(PLAYER_UNIT_TEST_ID)).toBeNull();
            expect(queryByTestId(GAME_UNIT_TEST_ID)).toBeNull();
            expect(queryByText(MAIN_SIDE_PANEL_TITLE)).toBeInTheDocument();
            expect(queryByText(WAIT_START_SIDE_PANEL_TITLE)).toBeNull();
            expect(queryByText(FIELDS_SIDE_PANEL_TITLE)).toBeNull();
        });
    });
});