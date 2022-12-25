let instance;

/// Overlay the board.
/// Render overlay objects, score, hints, other temporary animations and effects.
class Foreground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById('board-foreground');
            this.ctx = this.canvas.getContext('2d');
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;
    }

}

export default Foreground;
