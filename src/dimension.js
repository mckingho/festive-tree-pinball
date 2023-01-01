const BOARD_RATIO = 9 / 16;
const MATTER_MARGIN = 8;
const CONTROL_PANEL_RATIO = 1 / 16;
const MIN_FRAME_THICKNESS = 16;
const MIN_BALL_RADIUS = 5;
const MIN_LEVER_WIDTH = 5;

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

// returns geometry object of pot image that is rendered in board
// parms: board width, height
// returns: {dx, dy, height, width}
function potGeometry(width, height) {
    let potWidth = Math.floor(width / 5);
    let potHeight = potWidth;
    let dx = width / 2 - potWidth / 2;
    let dy = height / 3 * 2 - potHeight / 2;
    return {
        dx,
        dy,
        width: potWidth,
        height: potHeight,
    };
}

// returns seed width, height
function seedDimension(width, height) {
    let seedWidth = Math.floor(width / 15);
    return {
        width: seedWidth,
        height: seedWidth,
    };
}

// returns geometry object of faucet image that is rendered in board
// params: board width, height
// returns: {dx, dy, height, width}
function faucetGeometry(width, height) {
    const faucetHeight = Math.floor(height / 12);
    const faucetWidth = faucetHeight;
    let dx = width / 2 - faucetWidth / 2;
    let dy = height / 12 * 1.5 - faucetHeight / 2; // at top part
    return {
        dx,
        dy,
        width: faucetWidth,
        height: faucetHeight,
    };
}

// returns faucet's lever bar's width, length,
// params: board width, faucet height
function leverDimension(width, faucetHeight) {
    let barWidth = Math.max(MIN_LEVER_WIDTH, Math.floor(width / 100));
    let barLength = faucetHeight;
    return {
        width: barWidth,
        length: barLength,
    }
}

// calculate center of mass of regular shape
// vertices: array of {x, y}
// return {x, y} coordinate
function regularCenterOfMass(vertices) {
    let x = 0;
    let y = 0;
    for (const verts of vertices) {
        x += verts.x || 0;
        y += verts.y || 0;
    }
    return {
        x: x / vertices.length,
        y: y / vertices.length,
    };
}

export {
    MATTER_MARGIN,
    maxBoardDimension,
    boardControllerHeight,
    frameThickness,
    ballRadius,
    potGeometry,
    seedDimension,
    faucetGeometry,
    leverDimension,
    regularCenterOfMass,
};
