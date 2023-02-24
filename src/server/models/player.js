class Player {
    _id;
    _name;

    constructor(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    toJSON() {
        return { id: this.id, name: this.name };
    }
}

export default Player;