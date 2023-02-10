import { getConfig, getIndices } from './settings.js'

let instance;
// stages' achievement, including levels

class Achievement {
    constructor() {
        if (!instance) {
            this.hits = {
                faucet: 0,
            };

            this.level = 0;
            const indices = getIndices();
            this.maxLevel = indices.length - 1;
            for (let i = 0; i < indices.length; i += 1) {
                if (indices[i] == 'leaves3') {
                    this.faucetMaxLevel = i;
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
        }

        return false;
    }
}

export default Achievement;
