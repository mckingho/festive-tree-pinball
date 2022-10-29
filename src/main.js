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
        let board = document.querySelector('#board');
        object = new MatterObject(board, boardWidth, boardHeight);
    } else {
        object.resizeRender(boardWidth, boardHeight);
    }

    let boardContainer = document.querySelector('#board-container');
    boardContainer.style.width = boardWidth + 'px';
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
