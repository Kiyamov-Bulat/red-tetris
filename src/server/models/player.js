import {SCORE_COLLAPSE_UNIT, SCORE_UNIT} from "../../utils/constants";

class Player {
    static DEFAULT_NAME = 'Noob';
    _id;
    _name;
    _socket;
    _game;
    _score;

    constructor(id, socket) {
        this._id = id;
        this._socket = socket;
        this._name = Player.DEFAULT_NAME;
        this._score = 0;

        socket.player = this;
    }

    get id() {
        return this._id;
    }

    get socket() {
        return this._socket;
    }
    get name() {
        return this._name;
    }

    get game() {
        return this._game;
    }
    
    set game(aGame) {
        this._game = aGame;
    }

    get score() {
        return this._score;
    }

    updateScore(collapsedLines) {
        if (collapsedLines) {
            this._score += SCORE_COLLAPSE_UNIT * collapsedLines;
        } else {
            this._score += SCORE_UNIT;
        }
    }

    toJSON() {
        return { id: this.id, name: this.name, score: this.score };
    }
}

export default Player;