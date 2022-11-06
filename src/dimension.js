const BOARD_RATIO = 9 / 16;
const MATTER_MARGIN = 8;

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

// calculate the frame thickness of board
function frameThickness(width) {
    return Math.max(1, Math.floor(width / 100));
}

export {
    maxBoardDimension,
    frameThickness,
    MATTER_MARGIN,
};
