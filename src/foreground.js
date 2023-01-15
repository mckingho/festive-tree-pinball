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

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

    draw(width, height) {
        this.ctx.clearRect(0, 0, width, height);
        this.drawScoreBg(width);
        this.drawScore(width);
        this.drawWatering(width, height);

        if (this.wateringBits > 0) {
            window.requestAnimationFrame(() => { this.draw(width, height); });
        }
    }

    drawScoreBg(width) {
        const padding = frameThickness(width);
        this.ctx.font = padding + 'px Helvetica';
        const bgWidth = padding * 3 + this.ctx.measureText(this.score.val()).width;
        this.ctx.beginPath();
        this.ctx.roundRect(-padding, padding, bgWidth, padding * 2, padding);
        this.ctx.fillStyle = 'rgba(75, 75, 75, 0.5)';
        this.ctx.fill();
    }

    drawScore(width) {
        const padding = frameThickness(width);
        this.ctx.font = padding + 'px Helvetica';
        const val = this.score.val();
        const textWidth = this.ctx.measureText(val).width;
        const gradient = this.ctx.createLinearGradient(padding, 0, padding + textWidth, 0);
        gradient.addColorStop(0, '#00FF00');
        gradient.addColorStop(0.5, '#FFFF00');
        gradient.addColorStop(1, '#FF0000');
        this.ctx.strokeStyle = gradient;
        this.ctx.strokeText(val, padding, padding * 2.5);
    }

    /// draw water fall from faucet to pot.
    /// lines diverge downwards in an isosceles trapezoid region
    drawWatering(width, height) {
        const { dx: faucetDx, dy: faucetDy, width: faucetWidth, height: faucetHeight } = faucetGeometry(width, height);
        const { dy: potDy, width: potWidth } = potGeometry(width, height);
        const upperDx = faucetDx + faucetWidth * 0.2; // FIXME: faucet's width is roughly 60% in img src
        const upperWidth = faucetWidth * 0.6; // FIXME: faucet's width is roughly 60% in img src
        const dy = faucetDy + faucetHeight;
        const wateringHeight = potDy - dy;
        const lowerWidth = potWidth;
        const yStepMin = wateringHeight / 60; // assume 60 frames/s

        this.ctx.strokeStyle = 'rgba(174, 194, 224,0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';

        const n = 16;
        // init new waters if not watering 
        if (this.wateringBits == 0) {
            this.waters = [];
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
                })
                this.wateringBits |= (1 << i);
            }
        }

        // draw and update waters
        for (let i = 0; i < this.waters.length; i += 1) {
            const w = this.waters[i];
            if ((this.wateringBits >> i) & 1) {
                const x2 = w.x + w.xStep;
                const y2 = w.y + w.yStep;
                if (y2 < potDy) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(w.x, w.y);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                } else {
                    // set bits to not draw
                    this.wateringBits &= ~(1 << i);
                }
                // update x, y for animation
                this.waters[i].x = x2;
                this.waters[i].y = y2;
            }
        }
    }
}

export default Foreground;
