import { maxBoardDimension, boardControllerHeight, MATTER_MARGIN } from './dimension.js';
import MatterObject from './object.js';
import ObjectBackground from './object-background.js';

// max full board size
let boardWidth = 0;
let boardHeight = 0;
let controllerHeight = 0;

let object;
let objectBg; // object's background

function resizeBoard() {
    ({ boardWidth, boardHeight } = maxBoardDimension(window.innerWidth, window.innerHeight));
    // adjust board height for controller
    ({ boardHeight, controllerHeight } = boardControllerHeight(boardHeight));

    // init object / resize object's render
    if (!object) {
        let board = document.querySelector('#board');
        object = new MatterObject(board, boardWidth, boardHeight);
    } else {
        object.resizeRender(boardWidth, boardHeight);
    }
    if (!objectBg) {
        objectBg = new ObjectBackground();
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

    // controller position
    let controlPanel = document.getElementById('controller');
    controlPanel.style.width = boardWidth + 'px';
    controlPanel.style.height = controllerHeight + 'px';

    // rebuild
    object.buildEngine();
    objectBg.draw();
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
