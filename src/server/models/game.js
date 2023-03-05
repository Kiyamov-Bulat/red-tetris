import {v4 as uuidv4} from 'uuid';
import Tetramino from "./tetramino";
import randomChoice from "../../utils/randomChoice";

class Game {
    static GAME_LIST = [];

    _host;
    _id;
    _isOver;
    _createdAt;
    _players;
    _tetraminoQueue;
    _isStarted;

    constructor(host) {
        this._host = host;
        this._id = uuidv4();
        this._createdAt = new Date();
        this._players = [];
        this._tetraminoQueue = [];
        this._isStarted = false;
        this._isOver = false;
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
        };
    }

    generateFirstTetramino() {
        return Tetramino.generate();
    }

    getNextTetramino(playerId) {
        const nextTetraminoIndex = this._tetraminoQueue.findIndex(({ players }) => !players[playerId]);

        if (nextTetraminoIndex === -1) {
            const newTetramino = {
                value: Tetramino.generate(),
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
        return this.generateFirstTetramino();
    }

    finish() {
        this._isStarted = false;
        this._isOver = true;
    }

    static getAll() {
        return [...this.GAME_LIST];
    }

    static getAllAvailable() {
        return this.getAll().filter((game) => !game.isStarted);
    }

    static create(host) {
        const game = new Game(host);

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