import { frameThickness, potGeometry, faucetGeometry } from './dimension.js';
import Score from './score.js';

let instance;

/// Overlay the board.
/// Render overlay objects, score, hints, other temporary animations and effects.
class Foreground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById('board-foreground');
            this.ctx = this.canvas.getContext('2d');

            this.score = new Score();

            // for faucet to pot watering animation
            this.wateringBits = 0; // watering if some bits set
            this.waters = [];

            // for level up animation
            this.levelUp = null;

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);
        this.drawScoreBg();
        this.drawScore();
        this.drawLevelUp();
        this.drawWatering();

        if (this.wateringBits > 0 || this.levelUp) {
            window.requestAnimationFrame(() => { this.draw(); });
        }
        if (this.wateringBits > 0) {
            this.updateWatering();
        }
        if (this.levelUp) {
            this.updateLevelUp();
        }
    }

    drawScoreBg() {
        const width = this.canvas.width;
        const padding = frameThickness(width);
        this.ctx.font = padding + 'px Helvetica';
        const bgWidth = padding * 3 + this.ctx.measureText(this.score.val()).width;
        this.ctx.beginPath();
        this.ctx.roundRect(-padding, padding, bgWidth, padding * 2, padding);
        const gradient = this.ctx.createLinearGradient(0, 0, bgWidth, 0);
        gradient.addColorStop(0, '#00FF00');
        gradient.addColorStop(0.5, '#FFFF00');
        gradient.addColorStop(1, '#FF0000');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawScore() {
        const width = this.canvas.width;
        const padding = frameThickness(width);
        this.ctx.font = padding + 'px Helvetica';
        const val = this.score.val();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.strokeText(val, padding, padding * 2.5);
    }

    /// init animation of level up text
    animateLevelUp() {
        const width = this.canvas.width;
        const padding = frameThickness(width);
        const val = 'Next stage 🎄';
        const valWidth = this.ctx.measureText(val).width + padding; // add emoji length
        this.levelUp = {
            font: padding + 'px Helvetica',
            val,
            valWidth,
            textX: -valWidth + 2,
            textY: padding * 5,
            bgX: -valWidth - padding - 5, // extra length to hide left round
            bgY: padding * 4,
            bgWidth: valWidth + 2 * (padding + 5), // extra length to hide left round
            bgHeight: padding * 1.2,
            stepX: 2,
            maxX: padding,
            cooldown: 10, // staying after animation
        };
    }

    drawLevelUp() {
        if (this.levelUp) {
            this.ctx.beginPath();
            this.ctx.roundRect(this.levelUp.bgX, this.levelUp.bgY, this.levelUp.bgWidth, this.levelUp.bgHeight, 5);
            const gradient = this.ctx.createLinearGradient(this.levelUp.bgX, this.levelUp.bgY, this.levelUp.bgX + this.levelUp.bgWidth, this.levelUp.bgY);
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.2)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.fillStyle = 'black';
            this.ctx.font = this.levelUp.font;
            this.ctx.fillText(this.levelUp.val, this.levelUp.textX, this.levelUp.textY);
        }
    }

    /// update level up object for animation
    updateLevelUp() {
        if (this.levelUp.textX >= this.levelUp.maxX) {
            this.levelUp.cooldown -= 1;
            if (this.levelUp.cooldown < 0) {
                this.levelUp = null;
            }
        } else {
            this.levelUp.textX += this.levelUp.stepX;
            this.levelUp.bgX += this.levelUp.stepX;
        }
    }

    /// init animation of water falling from faucet to pot.
    /// lines diverge downwards in an isosceles trapezoid region
    animateWatering() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        if (this.waters.length != 0 || this.wateringBits > 0) return;

        const { dx: faucetDx, dy: faucetDy, width: faucetWidth, height: faucetHeight } = faucetGeometry(width, height);
        const { dy: potDy, width: potWidth } = potGeometry(width, height);
        const upperDx = faucetDx + faucetWidth * 0.2; // FIXME: faucet's width is roughly 60% in img src
        const upperWidth = faucetWidth * 0.6; // FIXME: faucet's width is roughly 60% in img src
        const dy = faucetDy + faucetHeight;
        const wateringHeight = potDy - dy;
        const lowerWidth = potWidth;
        const yStepMin = wateringHeight / 60; // assume 60 frames/s

        const n = 16;
        // init new waters if not watering 
        for (let i = 0; i < n; i += 1) {
            const xRand = Math.random();
            const x = xRand * upperWidth + upperDx; // starting x coordinate at faucet
            const xEnd = xRand * lowerWidth + upperDx - (lowerWidth - upperWidth) / 2; // x coordinate at pot
            const y = dy; // starting y coordinate at faucet
            const x2y = (xEnd - x) / (wateringHeight); // step ratio
            const yStep = Math.random() * yStepMin + yStepMin; // water step on y coordinate
            const xStep = yStep * x2y;
            this.waters.push({
                x,
                y,
                xStep,
                yStep,
                yMax: potDy,
            })
            this.wateringBits |= (1 << i);
        }

        this.draw();
    }

    /// draw watering with waters data
    drawWatering() {
        this.ctx.strokeStyle = 'rgba(174, 194, 224,0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';

        for (let i = 0; i < this.waters.length; i += 1) {
            const w = this.waters[i];
            if ((this.wateringBits >> i) & 1) {
                const x2 = w.x + w.xStep;
                const y2 = w.y + w.yStep;
                if (y2 < w.yMax) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(w.x, w.y);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateWatering() {
        for (let i = 0; i < this.waters.length; i += 1) {
            const w = this.waters[i];
            const x2 = w.x + w.xStep;
            const y2 = w.y + w.yStep;
            if (y2 >= w.yMax) {
                // set bits to not draw
                this.wateringBits &= ~(1 << i);
            }
            this.waters[i].x = x2;
            this.waters[i].y = y2;
        }
        // clear waters
        if (this.wateringBits == 0) {
            this.waters = [];
        }
    }
}

export default Foreground;
