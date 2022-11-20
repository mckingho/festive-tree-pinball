const BOARD_RATIO = 9 / 16;
const MATTER_MARGIN = 8;
const CONTROL_PANEL_RATIO = 1 / 16;
const MIN_FRAME_THICKNESS = 16;
const MIN_BALL_RADIUS = 5;

function maxBoardDimension(maxWidth, maxHeight) {
    let boardWidth = 0;
    let boardHeight = 0;

    if (maxWidth / BOARD_RATIO < maxHeight) {
        boardWidth = maxWidth;
        boardHeight = Math.floor(boardWidth / BOARD_RATIO);
    } else {
        boardHeight = maxHeight;
        boardWidth = Math.floor(boardHeight * BOARD_RATIO);
    }

    if (boardWidth > MATTER_MARGIN * 2) {
        boardWidth -= MATTER_MARGIN * 2;
    }
    if (boardHeight > MATTER_MARGIN * 2) {
        boardHeight -= MATTER_MARGIN * 2;
    }

    return { boardWidth, boardHeight };
}

// calculate split board and controller height
// totalHeight: total height of board and controller
function boardControllerHeight(totalHeight) {
    const controllerHeight = Math.floor(totalHeight * CONTROL_PANEL_RATIO);
    return {
        boardHeight: totalHeight - controllerHeight,
        controllerHeight,
    }
}

// calculate the frame thickness of board
function frameThickness(width) {
    return Math.max(MIN_FRAME_THICKNESS, Math.floor(width / 100));
}

// calculate the ball radius, scaling same with frame thickness
function ballRadius(width) {
    return Math.max(MIN_BALL_RADIUS, Math.floor(width / 100));
}

export {
    maxBoardDimension,
    boardControllerHeight,
    frameThickness,
    ballRadius,
    MATTER_MARGIN,
};
