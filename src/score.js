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
        this.value += value;
    }

    // cleanup
    clear() {
        instance = null;
    }
}

export default Score;
