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
            this.maxLevel = getIndices().length - 1;

            instance = this;
        }
        return instance;
    }

    // check level with stage goals
    // return whether level up
    checkLevelUp() {
        console.log(this.level);
        const c = getConfig(this.level);
        if (this.level == 0) {
            if (c.faucetHitRequirement <= this.hits.faucet) {
                this.level += 1;
                return true;
            }
        }

        return false;
    }
}

export default Achievement;
