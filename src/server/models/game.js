import { v4 as uuidv4 } from 'uuid';
import tetramino from "./tetramino";
import Tetramino from "./tetramino";

class Game {
    static GAME_LIST = [];

    _host;
    _id;
    _isOver;
    _createdAt;
    _players;
    _tetraminoQueue;

    constructor(host) {
        this._host = host;
        this._id = uuidv4();
        this._createdAt = new Date();
        this._players = [];
        this._tetraminoQueue = [];
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

    get players() {
        return this._players;
    }

    connect(player) {
        this.players.push(player);
    }

    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            host: this.host.toJSON(),
            players: this.players.map((player) => player.toJSON()),
        };
    }

    generateFirstTetramino() {
        this._tetraminoQueue.push({
            value: Tetramino.generate(),
            players: this.players.reduce((acc, player) => {
                acc[player.id] = true;
                return acc;
            }, {}),
        });
        return this._tetraminoQueue[0].value;
    }

    getNextTetramino(playerId) {
        const nextTetraminoIndex = this._tetraminoQueue.findIndex(({ players }) => !players[playerId]);

        if (nextTetraminoIndex === -1) {
            this._tetraminoQueue.push({
                value: Tetramino.generate(),
                players: { [playerId]: true },
            });
            return this._tetraminoQueue[this._tetraminoQueue.length - 1].value;
        }

        const nextTetramino = this._tetraminoQueue[nextTetraminoIndex];

        this._tetraminoQueue[nextTetraminoIndex].players[playerId] = true;

        if (Object.values(this._tetraminoQueue[nextTetraminoIndex]).every((player) => player)) {
            this._tetraminoQueue.splice(nextTetraminoIndex, 1);
        }

        return nextTetramino.value;
    }

    static getAll() {
        return [...this.GAME_LIST];
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