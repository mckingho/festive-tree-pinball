import { frameThickness } from './dimension.js';
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
        this.drawScoreBg(width);
        this.drawScore(width)
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
}

export default Foreground;
