/*
* handler functions for matterjs events
*/
import Score from './score.js';
import Foreground from './foreground.js';
import Object from './object.js';
import ObjectBackground from './object-background.js';
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
        const obj = new Object();
        obj.updateStageObjects();
        const bg = new ObjectBackground();
        bg.draw(achievement.level);
    }
    fg.draw();
}

function hitOrnament(value, i) {
    const score = new Score();
    score.add(value);

    const achievement = new Achievement();
    achievement.hits.ornament[i] += 1;

    const bg = new ObjectBackground();
    bg.setShowCharacter(achievement.hits.ornament.map((h) => h % 2 == 1));
    bg.draw(achievement.level);

    if (achievement.checkLevelUp()) {
        const fg = new Foreground();
        fg.animateLevelUp();
        fg.draw();
        const obj = new Object();
        obj.updateStageObjects();
    }
}

export {
    addScore,
    turnFaucet,
    hitOrnament,
};
