import { maxBoardDimension } from './dimension.js';
import MatterObject from './object.js';

// max full board size
let boardWidth = 0;
let boardHeight = 0;

let object;

function resizeBoard() {
    ({ boardWidth, boardHeight } = maxBoardDimension(window.innerWidth, window.innerHeight));

    // init object / resize object's render
    if (!object) {
        object = new MatterObject(document.body, boardWidth, boardHeight);
    } else {
        object.resizeRender(boardWidth, boardHeight);
    }
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
