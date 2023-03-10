/*
Screen panel's functions
*/
import Ach from './stages/achievement.json' assert { type: "json" };
import Achievement from './stages/achievement.js';
import Score from './score.js';

// update screen panel's achievement and score
function updateScreenPanel() {
    const achievement = new Achievement();
    for (const key of Ach.index) {
        let success = false;
        switch (key) {
            case 'faucet':
                success = achievement.isBadgeFaucet();
                break;
            case 'tree':
                success = achievement.isBadgeTree();
                break;
            case 'bear':
                success = achievement.isBadgeBear();
                break;
            case 'gingerbread':
                success = achievement.isBadgeGingerbread();
                break;
            case 'reindeer':
                success = achievement.isBadgeReindeer();
                break;
            case 'snowman':
                success = achievement.isBadgeSnowman();
                break;
            case 'star':
                success = achievement.isBadgeStar();
                break;
            case '100':
                success = achievement.isBadge100();
                break;
            case 'calendar':
                success = achievement.isBadgeCalendar();
                break;
        }

        const isHidden = !success && Ach.requireHidden[key];
        const badgeEl = document.getElementById('ach-' + key + '-badge');
        badgeEl.innerHTML = isHidden ? Ach.hidden.badge : Ach.badges[key];
        const textEl = document.getElementById('ach-' + key + '-text');
        textEl.innerHTML = isHidden ? Ach.hidden.text : Ach.texts[key];

        const el = document.getElementById('ach-' + key);
        if (success) {
            el.classList.add('ach-success');
            el.classList.remove('ach-locked');
        } else {
            el.classList.remove('ach-success');
            el.classList.add('ach-locked');
        }
    }
    const score = new Score();
    const scoreEl = document.getElementById('score-val');
    scoreEl.innerHTML = score.val();
}

export {
    updateScreenPanel,
}
