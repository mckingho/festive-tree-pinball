import { maxBoardDimension } from './dimension.js';

// max full board size
let boardWidth = 0;
let boardHeight = 0;

function resizeBoard() {
    ({ boardWidth, boardHeight } = maxBoardDimension(window.innerWidth, window.innerHeight));
    console.log([boardWidth, boardHeight]);
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
