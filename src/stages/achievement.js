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
}

export default Achievement;
