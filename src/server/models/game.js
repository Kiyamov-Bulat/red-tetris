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

    }

    get id() {
        return this._id;
    }

    connect(player) {

    }

    static getAll() {
        return [...this.GAME_LIST];
    }

    static create(host) {
        const game = new Game(host);

        this.GAME_LIST.push(game);

        return game;
    }

    static remove(game) {
        this.GAME_LIST = this.GAME_LIST.filter((next) => next.id !== game.id);
    }
}