import { potGeometry, seedDimension, faucetGeometry } from './dimension.js';
import { getConfig } from './stages/settings.js'

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

            this.faucetImg = new Image();
            this.faucetImg.src = 'resources/images/faucet.png';

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

    draw(width, height, stage = 0) {
        let w = width;
        let h = height;

        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, 0, w, h);

        // get stage render config
        const stageConfig = getConfig(stage);

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

        if (!this.isInitDrawn) {
            this.faucetImg.onload = () => {
                if (stageConfig.faucet) {
                    this.drawFaucet();
                }
            }
        }
        if (stageConfig.faucet) {
            this.drawFaucet()
        }

        this.isInitDrawn = true;

        // starting animation
        if (this.seedYOffset > 0) {
            this.seedYOffset = this.seedYOffset - 1;
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
        let dx = w / 2 - width / 2;
        let dy = this.potY - height - this.seedYOffset;
        this.ctx.drawImage(this.seedImg, dx, dy, width, height);
    }

    drawFaucet() {
        let { dx, dy, width, height } = faucetGeometry(this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.faucetImg, dx, dy, width, height);
    }
}

export default ObjectBackground;
