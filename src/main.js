import { maxBoardDimension, MATTER_MARGIN } from './dimension.js';
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

    // adjust board position
    let boardContainer = document.getElementById('board-container');
    boardContainer.style.width = boardWidth + 'px';
    let boardBackground = document.getElementById('board-background');
    boardBackground.style.width = boardWidth + 'px';
    boardBackground.style.height = boardHeight + 'px';
    let board = document.getElementById('board');
    let marginTopOffset = boardHeight + MATTER_MARGIN / 2;
    board.style.marginTop = '-' + marginTopOffset + 'px';

    // rebuild
    object.buildEngine();
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
