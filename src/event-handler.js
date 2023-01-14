/*
* handler functions for matterjs events
*/
import Score from './score.js';

function addScore(value) {
    const score = new Score();
    score.add(value);
    console.log(score.val());
}

export {
    addScore,
};
