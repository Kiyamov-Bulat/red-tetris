import { v4 as uuidv4 } from 'uuid';

class Game {
    static GAME_LIST = [];

    _host;
    _id;
    _isOver;
    _createdAt;
    _players;

    constructor(host) {
        this._host = host;
        this._id = uuidv4();
        this._createdAt = new Date();
        this._players = [];
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