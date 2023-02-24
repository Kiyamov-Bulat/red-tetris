class SelfPreservingPromise {
    constructor(promise) {
        this.lastPromise = promise;
    }
    then(onfulfilled, onrejected) {
        this.lastPromise = this.lastPromise.then(onfulfilled, onrejected);

        return this;
    }
}

export default SelfPreservingPromise;
