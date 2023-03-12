import { maxBoardDimension, boardControllerHeight, MATTER_MARGIN } from './dimension.js';
import MatterObject from './object.js';
import ObjectBackground from './object-background.js';
import { handleKeyDown, handleClick } from './controller.js';
import Foreground from './foreground.js';
import env from './env.json' assert { type: "json" };
import { showScreen, updateScreenPanel } from './screen.js';
import Achievement from './stages/achievement.js';
import Score from './score.js';

// max full board size
let boardWidth = 0;
let boardHeight = 0;
let controllerHeight = 0;

let object;
let objectBg; // object's background
let fg; // foreground

// Store the event function of controllers
let barKeyDownFn;
let barLeftClickFn;
let barRightClickFn;
let resetBallFn;

function adjustSize() {
    ({ boardWidth, boardHeight } = maxBoardDimension(window.innerWidth, window.innerHeight));
    // adjust board height for controller
    ({ boardHeight, controllerHeight } = boardControllerHeight(boardHeight));

    // adjust board position
    const boardContainer = document.getElementById('board-container');
    boardContainer.style.width = boardWidth + 'px';
    const board = document.getElementById('board');
    const marginTopOffset = boardHeight + MATTER_MARGIN / 2;
    board.style.marginTop = '-' + marginTopOffset + 'px';
    const fgDiv = document.getElementById('board-foreground');
    fgDiv.style.marginTop = '-' + marginTopOffset + 'px';

    // controller position
    const controlPanel = document.getElementById('controller');
    controlPanel.style.width = boardWidth + 'px';
    controlPanel.style.height = controllerHeight + 'px';

    // screen panel position
    const screenPanel = document.getElementById('screen-panel');
    screenPanel.style.width = boardWidth + 'px';
}

function initMatterObject() {
    // init object / resize object's render
    if (!object) {
        const board = document.querySelector('#board');
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
}

function buildMatterObject() {
    // rebuild
    object.buildEngine();
    objectBg.draw();
    fg.draw();

    // reset event of controller object
    const { left: barL, right: barR } = object.getControlBars();
    window.removeEventListener('keydown', barKeyDownFn);
    barKeyDownFn = (event) => { handleKeyDown(event, barL, barR) };
    window.addEventListener("keydown", barKeyDownFn);
    const controllerLeft = document.getElementById('btn-left');
    const controllerRight = document.getElementById('btn-right');
    controllerLeft.removeEventListener('click', barLeftClickFn);
    controllerRight.removeEventListener('click', barRightClickFn);
    barLeftClickFn = () => { handleClick(true, false, barL, barR) };
    barRightClickFn = () => { handleClick(false, true, barL, barR) };
    controllerLeft.addEventListener("click", barLeftClickFn);
    controllerRight.addEventListener("click", barRightClickFn);

    // hotkey to reset ball
    window.removeEventListener("keypress", resetBallFn);
    resetBallFn = (event) => { if (env.dev && event.key == 'r') object.resetBall() };
    window.addEventListener("keypress", resetBallFn);
}

function onLoad() {
    adjustSize();
    updateScreenPanel();
    showScreen();
    initMatterObject();
    buildMatterObject();
}

function onResize() {
    adjustSize();
    stopGame();
}

function startGame() {
    if (object) {
        object.start();
    }
}

function stopGame() {
    if (object) {
        object.stop();
        updateScreenPanel();
        showScreen();
        clear();
    }

    // init for next game
    initMatterObject();
    buildMatterObject();
}

function clear() {
    if (object) {
        object.clear();
        object = null;

        // clear in case of initiated
        const achievement = new Achievement();
        const score = new Score();
        achievement.clear();
        score.clear();
    }
    if (objectBg) {
        objectBg.clear();
        objectBg = null;
    }
    if (fg) {
        fg.clear();
        fg = null;
    }
}

window.addEventListener('load', onLoad);
window.addEventListener("resize", onResize);
// Custom event handling
window.addEventListener('customStart', startGame);
window.addEventListener('customStop', stopGame);
