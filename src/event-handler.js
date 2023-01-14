/*
* handler functions for matterjs events
*/
import Score from './score.js';

function addScore(value) {
    const score = new Score();
    score.add(value);
    window.dispatchEvent(new Event('custom-refresh-fg'));
}

export {
    addScore,
};
