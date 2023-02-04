/*
* handler functions for matterjs events
*/
import Score from './score.js';
import Foreground from './foreground.js';
import Achievement from './stages/achievement.js';

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
    const achievement = new Achievement();
    achievement.hits.faucet += 1;

    if (achievement.checkLevelUp()) {
        fg.animateLevelUp();
    }
    fg.draw();
}

export {
    addScore,
    turnFaucet,
};
