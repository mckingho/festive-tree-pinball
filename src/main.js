import { maxBoardDimension, boardControllerHeight, MATTER_MARGIN } from './dimension.js';
import MatterObject from './object.js';
import ObjectBackground from './object-background.js';
import { handleKeyDown, handleKeyUp, handleClick } from './controller.js';
import Foreground from './foreground.js';

// max full board size
let boardWidth = 0;
let boardHeight = 0;
let controllerHeight = 0;

let object;
let objectBg; // object's background
let fg; // foreground

// Store the event function of controllers
let barKeyDownFn;
let barKeyUpFn;
let barLeftClickFn;
let barRightClickFn;

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
    objectBg.resizeRender(boardWidth, boardHeight);
    if (!fg) {
        fg = new Foreground();
    }
    fg.resizeRender(boardWidth, boardHeight);

    // adjust board position
    let boardContainer = document.getElementById('board-container');
    boardContainer.style.width = boardWidth + 'px';
    let board = document.getElementById('board');
    let marginTopOffset = boardHeight + MATTER_MARGIN / 2;
    board.style.marginTop = '-' + marginTopOffset + 'px';
    let fgDiv = document.getElementById('board-foreground');
    fgDiv.style.marginTop = '-' + marginTopOffset + 'px';

    // controller position
    let controlPanel = document.getElementById('controller');
    controlPanel.style.width = boardWidth + 'px';
    controlPanel.style.height = controllerHeight + 'px';

    // rebuild
    object.buildEngine();
    objectBg.draw(boardWidth, boardHeight);

    // reset event of controller object
    let { left: barL, right: barR } = object.getControlBars();
    window.removeEventListener('keydown', barKeyDownFn);
    window.removeEventListener('keyup', barKeyUpFn);
    barKeyDownFn = (event) => { handleKeyDown(event, barL, barR) };
    barKeyUpFn = (event) => { handleKeyUp(event, barL, barR) };
    window.addEventListener("keydown", barKeyDownFn);
    window.addEventListener("keyup", barKeyUpFn);
    let controllerLeft = document.getElementById('btn-left');
    let controllerRight = document.getElementById('btn-right');
    controllerLeft.removeEventListener('click', barLeftClickFn);
    controllerRight.removeEventListener('click', barRightClickFn);
    barLeftClickFn = () => { handleClick(true, false, barL, barR) };
    barRightClickFn = () => { handleClick(false, true, barL, barR) };
    controllerLeft.addEventListener("click", barLeftClickFn);
    controllerRight.addEventListener("click", barRightClickFn);
}

window.addEventListener('load', resizeBoard);
window.addEventListener("resize", resizeBoard);
