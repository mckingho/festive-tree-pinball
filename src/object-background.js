import { potGeometry } from './dimension.js';

let instance;

class ObjectBackground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById('board-background');
            this.ctx = this.canvas.getContext('2d');

            this.potImg = new Image();
            this.potImg.src = 'resources/images/pot.png';
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

    draw(width, height) {
        let w = width;
        let h = height;

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.potImg.onload = () => {
            this.drawPot();
        }
        this.drawPot()
    }

    drawPot() {
        let { dx, dy, width, height } = potGeometry(this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.potImg, dx, dy, width, height);
    }
}

export default ObjectBackground;
