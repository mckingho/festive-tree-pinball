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
}

export default Score;
