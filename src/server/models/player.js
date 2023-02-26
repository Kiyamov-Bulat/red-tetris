class Player {
    _id;
    _name;

    _socket;

    constructor(id, socket) {
        this._id = id;
        this._socket = socket;
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

    toJSON() {
        return { id: this.id, name: this.name };
    }
}

export default Player;