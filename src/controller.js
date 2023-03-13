/* handle controllers' key and click events */
const Body = Matter.Body;

const FORCE = 0.1; // TODO may scale with board size
const LEFT_KEYS = new Set([65, 37, 100, 90, 74]); // a, '<-', numpad 4, z, j
const RIGHT_KEYS = new Set([68, 39, 102, 191, 76]); // d, '->', numpad 6, /, l

function applyLeftForce(bar) {
    Body.applyForce(bar, { x: bar.position.x, y: bar.position.y }, { x: FORCE, y: -FORCE });
}

function applyRightForce(bar) {
    Body.applyForce(bar, { x: bar.position.x, y: bar.position.y }, { x: -FORCE, y: -FORCE });
}

function handleKeyDown(evt, barL, barR) {
    if (LEFT_KEYS.has(evt.keyCode)) {
        applyLeftForce(barL);
    }

    if (RIGHT_KEYS.has(evt.keyCode)) {
        applyRightForce(barR);
    }
}

function handleClick(isLeft, isRight, barL, barR) {
    if (isLeft) {
        applyLeftForce(barL);
    }
    if (isRight) {
        applyRightForce(barR);
    }
}

export {
    handleKeyDown,
    handleClick,
}
