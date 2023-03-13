let instance;

class Score {
    constructor() {
        if (!instance) {
            this.value = 0;

            instance = this;
        }
        return instance;
    }

    val() {
        return this.value;
    }

    add(value) {
        if (isNaN(value)) {
            console.error('invalid add score', value);
            return;
        }
        this.value += value;
    }

    // cleanup
    clear() {
        instance = null;
    }
}

export default Score;
