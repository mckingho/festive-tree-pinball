/*
* handler functions for matterjs events
*/
import Score from './score.js';
import Foreground from './foreground.js';

function addScore(value) {
    const score = new Score();
    score.add(value);

    const fg = new Foreground();
    fg.draw();
}

/// handler after faucet lever gets hit
function turnFaucet(value) {
    const fg = new Foreground();
    fg.animateWatering();
    const score = new Score();
    score.add(value);

    fg.draw();
}

export {
    addScore,
    turnFaucet,
};
