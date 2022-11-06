let instance;

class ObjectBackground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById("board-background");
            this.ctx = this.canvas.getContext("2d");
        }

        return instance;
    }

    draw() {
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default ObjectBackground;
