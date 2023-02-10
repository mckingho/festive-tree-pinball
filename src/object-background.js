import { potGeometry, seedDimension, faucetGeometry, trunkDimension, leavesGeometry } from './dimension.js';
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

            this.trunkImg = new Image();
            this.trunkImg.src = 'resources/images/trunk.png';

            this.leavesImgs = [new Image(), new Image(), new Image(), new Image()];
            this.trunkImg.onload = () => {
                this.leavesImgs[0].src = 'resources/images/leaves/leaves1.png';
                this.leavesImgs[1].src = 'resources/images/leaves/leaves2.png';
                this.leavesImgs[2].src = 'resources/images/leaves/leaves3.png';
                this.leavesImgs[3].src = 'resources/images/leaves/leaves4.png';
            }

            // init which and how leaves render
            this.leavesLoadIndices = Array(4).fill().map(() => Math.floor(Math.random() * 8));

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

    draw(stage = 0) {
        let w = this.canvas.width;
        let h = this.canvas.height;

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
        if (stageConfig.seed) {
            this.drawSeed()
        }

        if (stageConfig.trunk) {
            this.drawTrunk()
        }

        if (stageConfig.leavesMax && stageConfig.leavesMax > 0) {
            for (let i = 0; i < stageConfig.leavesMax; i += 1) {
                this.drawLeaves(i);
            }
        }

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
            window.requestAnimationFrame(() => { this.draw(); });
        }
    }

    drawPot() {
        let { dx, dy, width, height } = potGeometry(this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.potImg, dx, dy, width, height);
        this.potY = dy;
        this.potWidth = width;
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

    drawTrunk() {
        let { width, height } = trunkDimension(this.potWidth);
        let dx = this.canvas.width / 2 - width / 2;
        let dy = this.potY - height;
        this.ctx.drawImage(this.trunkImg, dx, dy, width, height);
    }

    drawLeaves(leavesLevel) {
        const { dx, dy, width, height } = leavesGeometry(this.canvas.width, this.canvas.height, leavesLevel);
        const loadIdx = this.leavesLoadIndices[leavesLevel];
        const imgIdx = Math.floor(loadIdx / 2);
        if (loadIdx % 2) {
            this.ctx.drawImage(this.leavesImgs[imgIdx], dx, dy, width, height);
        } else {
            // flip image
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.leavesImgs[imgIdx], -dx, dy, -width, height);
            this.ctx.restore();
        }
    }
}

export default ObjectBackground;
