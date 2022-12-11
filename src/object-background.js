import { potGeometry, seedDimension } from './dimension.js';

let instance;

class ObjectBackground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById('board-background');
            this.ctx = this.canvas.getContext('2d');

            this.isInitDrawn = false; // set true after first draw() function call
            this.potY = 0; // pot y position. set when pot is drawn
            this.seedYOffset = 60; // seed y position offset upwards. used for starting animation

            this.potImg = new Image();
            this.potImg.src = 'resources/images/pot.png';

            this.seedImg = new Image();
            this.seedImg.src = 'resources/images/pinecone.png';
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
        this.ctx.fillRect(0, 0, w, h);

        if (!this.isInitDrawn) {
            this.potImg.onload = () => {
                this.drawPot();
            }
        }
        this.drawPot()

        if (!this.isInitDrawn) {
            this.seedImg.onload = () => {
                this.drawSeed();
            }
        }
        this.drawSeed()

        this.isInitDrawn = true;

        // starting animation
        if (this.seedYOffset > 0) {
            window.requestAnimationFrame(() => { this.draw(w, h); });
        }
    }

    drawPot() {
        let { dx, dy, width, height } = potGeometry(this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.potImg, dx, dy, width, height);
        this.potY = dy;
    }

    drawSeed() {
        let w = this.canvas.width;
        let { width, height } = seedDimension(this.canvas.width, this.canvas.height);
        const downwardsFrames = 60;
        let dx = w / 2 - width / 2;
        this.seedYOffset = this.seedYOffset - 1;
        let dy = this.potY - height - this.seedYOffset;
        this.ctx.drawImage(this.seedImg, dx, dy, width, height);
    }
}

export default ObjectBackground;
