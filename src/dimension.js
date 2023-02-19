const BOARD_RATIO = 9 / 16;
const MATTER_MARGIN = 8;
const CONTROL_PANEL_RATIO = 1 / 16;
const MIN_FRAME_THICKNESS = 16;
const MIN_BALL_RADIUS = 8;
const MIN_BAR_STAND_RADIUS = 5;
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

// calculate the bar stand radius, scaling same with frame thickness
function barStandRadius(width) {
    return Math.max(MIN_BAR_STAND_RADIUS, Math.floor(width / 100));
}

// returns geometry object of pot image that is rendered in board
// parms: board width, height
// returns: {dx, dy, height, width}
function potGeometry(width, height) {
    let potWidth = Math.floor(width / 6);
    let potHeight = potWidth;
    let dx = width / 2 - potWidth / 2;
    let dy = height / 4 * 3;
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
    let dy = height / 12 * 2 - faucetHeight / 2; // at top part
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

// returns trunk width, height
function trunkDimension(potWidth) {
    let trunkWidth = Math.floor(potWidth * 2 / 3);
    return {
        width: trunkWidth,
        height: trunkWidth,
    };
}

// returns geometry object of leaves image that is rendered in board
// params: board width, height, leaves level from bottom
// returns: {dx, dy, height, width}
function leavesGeometry(width, height, i) {
    const leavesHeight = height * (1 / 9 + 1 / 12);
    const leavesWidth = leavesHeight;
    const dx = width / 2 - leavesWidth / 2;
    // growth = trunk + self height + previous levels' leaves
    const { width: potWidth } = potGeometry(width, height);
    const { height: trunkHeight } = trunkDimension(potWidth);
    const growth = trunkHeight + leavesHeight * 3 / 4 + height / 9 * i;
    const dy = height / 4 * 3 - growth;
    return {
        dx,
        dy,
        width: leavesWidth,
        height: leavesHeight,
    };
}

// returns geometry object of gift box related image that is rendered in board,
// including box, character, shelf
// params: board width, height, box id
// returns {dx, dy, height, width}
function giftGeometry(width, height, id) {
    const shelfWidth = width / 6;
    const side = shelfWidth / 2;
    const pad = 2;
    const pos = id % 4;
    const xMuls = [1, 1, -1, -1];
    const centerDx = width / 2 + xMuls[pos] * width / 4;
    const dx = centerDx - side / 2;
    const yMuls = [-1, 1, 1, -1];
    const dy = height / 2 + yMuls[pos] * (shelfWidth + pad);
    const shelfDx = centerDx - shelfWidth / 2;
    const shelfDy = dy + side;
    return {
        dx,
        dy,
        height: side,
        width: side,
        shelfDx,
        shelfDy,
        shelfWidth,
        shelfHeight: shelfWidth / 5,
    };
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
    barStandRadius,
    potGeometry,
    seedDimension,
    faucetGeometry,
    leverDimension,
    trunkDimension,
    leavesGeometry,
    giftGeometry,
    regularCenterOfMass,
};
