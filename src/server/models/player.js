class Player {
    static DEFAULT_NAME = 'Noob';
    _id;
    _name;
    _socket;
    _game;
    constructor(id, socket) {
        this._id = id;
        this._socket = socket;
        this._name = Player.DEFAULT_NAME;

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

    toJSON() {
        return { id: this.id, name: this.name };
    }
}

export default Player;