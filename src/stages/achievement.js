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
        } else if (this.level == leavesMaxLevel) {
            // level up from leaves to star
            // check every ornament hit % 2 == 1, i.e. all toggle on
            if (this.hits.ornament.every((h) => h % 2 == 1)) {
                this.level += 1;
                return true;
            }
        }

        return false;
    }
}

export default Achievement;
