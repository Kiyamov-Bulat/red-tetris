import {v4 as uuidv4} from 'uuid';
import Tetramino from "./tetramino";
import randomChoice from "../../utils/randomChoice";
import {GAME_MODE, TETRAMINO_TYPE} from "../../utils/constants";

class Game {
    static GAME_LIST = [];

    _host;
    _id;
    _isOver;
    _createdAt;
    _players;
    _tetraminoQueue;
    _isStarted;

    _mode;
    constructor(host, mode = GAME_MODE.COMMON) {
        this._host = host;
        this._id = uuidv4();
        this._createdAt = new Date();
        this._players = [];
        this._tetraminoQueue = [];
        this._isStarted = false;
        this._isOver = false;
        this._mode = mode;
    }

    get id() {
        return this._id;
    }

    get createdAt() {
        return this._createdAt;
    }

    get host() {
        return this._host;
    }

    set host(player) {
        this._host = player;
    }

    get players() {
        return this._players;
    }

    get isOver() {
        return this._isOver;
    }

    get isStarted() {
        return this._isStarted;
    }

    get mode() {
        return this._mode;
    }
    
    get isZ() {
        return this.mode === GAME_MODE.Z;
    }

    get isCommon() {
        return this.mode === GAME_MODE.COMMON;
    }

    get isRandomFilled() {
        return this.mode === GAME_MODE.FILLED;
    }

    connect(player) {
        player.game = this;
        player.socket.join(this.id);
        this.players.push(player);
    }

    disconnect(player) {
        player.game = null;
        player.socket.leave(this.id);
        this._players = this._players.filter((next) => next.id !== player.id);

        if (player.id === this.host.id) {
            this.host = randomChoice(this._players);
        }
    }

    isHost(player) {
        return this.host.id === player.id;
    }

    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            host: this.host?.toJSON(),
            players: this.players.map((player) => player?.toJSON()),
            isOver: this.isOver,
            isStarted: this.isStarted,
            mode: this.mode,
        };
    }
    
    generateTetramino() {
        this.isZ && Tetramino._setGeneratorType(TETRAMINO_TYPE.Z);

        const tetramino = Tetramino.generate();

        this.isZ && Tetramino._setGeneratorType(null);

        return tetramino;
    }

    getNextTetramino(playerId) {
        const nextTetraminoIndex = this._tetraminoQueue.findIndex(({ players }) => !players[playerId]);

        if (nextTetraminoIndex === -1) {
            const newTetramino = {
                value: this.generateTetramino(),
                players: { [playerId]: true },
            };

            this._tetraminoQueue.push(newTetramino);
            return newTetramino.value;
        }

        const nextTetramino = this._tetraminoQueue[nextTetraminoIndex];

        nextTetramino.players[playerId] = true;

        const players = Object.values(nextTetramino.players);

        if (players.length === this.players.length && players.every((player) => player)) {
            this._tetraminoQueue.splice(nextTetraminoIndex, 1);
        }

        return nextTetramino.value;
    }

    destroy() {
        this._isStarted = false;
        this._isOver = false;
        this._players = [];
        this._tetraminoQueue = [];
        this._host = null;
        this._createdAt = null;
        Game.GAME_LIST = Game.GAME_LIST.filter((game) => game.id !== this.id);
    }

    start() {
        this._isStarted = true;
        this._isOver = false;
        return this.generateTetramino();
    }

    finish() {
        this._isStarted = false;
        this._isOver = true;
    }

    getWinner(loser) {
        let score = -1;
        let winner = null;

        for (const player of this.players) {
           if (player.id !== loser.id && player.score > score) {
               winner = player;
               score = winner.score;
           }
        }
        return winner;
    }
    static getAll() {
        return [...this.GAME_LIST];
    }

    static getAllAvailable() {
        return this.getAll().filter((game) => !game.isStarted);
    }

    static create(host, mode = GAME_MODE.COMMON) {
        const game = new Game(host, mode);

        this.GAME_LIST.push(game);

        return game;
    }

    static get(gameId) {
        return this.GAME_LIST.find((game) => game.id === gameId);
    }

    static remove(game) {
        this.GAME_LIST = this.GAME_LIST.filter((next) => next.id !== game.id);
    }
}

export default Game;