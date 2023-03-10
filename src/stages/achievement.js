import { getConfig, getIndices } from './settings.js'

let instance;
// stages' achievement, including levels

class Achievement {
    constructor() {
        if (!instance) {
            this.hits = {
                faucet: 0,
                ornament: [0, 0, 0, 0],
            };

            this.level = 0;
            const indices = getIndices();
            this.maxLevel = indices.length - 1;
            for (let i = 0; i < indices.length; i += 1) {
                if (indices[i] == 'leaves3') {
                    this.faucetMaxLevel = i;
                }
                if (indices[i] == 'leaves4') {
                    this.leavesMaxLevel = i;
                }
            }

            // isSet flags for 4 digits on background calendar date
            this.isCalendarSet = [false, false, false, false];

            instance = this;
        }
        return instance;
    }

    // check level with stage goals
    // return whether level up
    checkLevelUp() {
        const c = getConfig(this.level);
        if (this.level <= this.faucetMaxLevel) { // faucet requirement to level up
            if (c.faucetHitRequirement <= this.hits.faucet) {
                this.level += 1;
                return true;
            }
        } else if (this.level == this.leavesMaxLevel) {
            // level up from leaves to star
            // check every ornament hit % 2 == 1, i.e. all toggle on
            if (this.hits.ornament.every((h) => h % 2 == 1)) {
                this.level += 1;
                return true;
            }
        }

        return false;
    }

    // check ornaments hits to see calendar's date is correctly set
    checkCalendarSet() {
        // consider ornaments hits to be 4 bit values,
        // order is from least significant bit to most significant bit,
        // i.e. ornament[0] is first bit
        //
        // check 0001, 0010 twice, 0101 (1225)

        const sum = this.hits.ornament.reduce((accum, h, idx) => accum + h % 2 * Math.pow(2, idx), 0);
        switch (sum) {
            case 1:
                this.isCalendarSet[0] = true;
                break;
            case 2:
                if (this.isCalendarSet[1]) {
                    this.isCalendarSet[2] = true;
                } else {
                    this.isCalendarSet[1] = true;
                }
                break;
            case 5:
                this.isCalendarSet[3] = true;
        }
    }

    //
    // checking for badge achievement
    //

    isBadgeFaucet() {
        // check faucet is hit at least once
        return this.hits.faucet > 0;
    }

    isBadgeTree() {
        // check current level reaches maximum leaves level
        return this.level >= this.leavesMaxLevel;
    }

    isBadgeBear() {
        return this.hits.ornament[1] > 0;
    }

    isBadgeGingerbread() {
        return this.hits.ornament[2] > 0;
    }

    isBadgeReindeer() {
        return this.hits.ornament[3] > 0;
    }

    isBadgeSnowman() {
        return this.hits.ornament[0] > 0;
    }

    isBadgeStar() {
        // check current level is after maximum leaves level
        // i.e. star level
        return this.level > this.leavesMaxLevel;
    }

    isBadge100() {
        // check sum of ornaments hit reaches 100
        const sum = this.hits.ornament.reduce((s, hit) => s + hit, 0);
        return sum >= 100;
    }

    isBadgeCalendar() {
        // check for 4 digit is set
        const isAllSet = this.isCalendarSet.reduce((s, isSet) => s && isSet, true);
        return isAllSet;
    }
}

export default Achievement;
