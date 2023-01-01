import { getConfig } from './settings.js'
import { faucetGeometry, leverDimension } from '../dimension.js';

const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

let instance;
/// matter objects to be added in different levels,
/// to be included in main board object.

class StageObjects {
    constructor() {
        if (!instance) {
            this.stage = 0;
            this.objects = [];
        }
        return instance;
    }

    reloadObjects(width, height, stage = 0) {
        this.objects = [];
        this.stage = stage;

        // get stage render config
        const stageConfig = getConfig(stage);

        if (stageConfig.faucet) {
            this.loadLever(width, height);
        }

        return this.objects;
    }

    /// lever 
    /// 2 rectangles to form + shape
    loadLever(width, height) {
        const { dx, dy, width: faucetWidth, height: faucetHeight } = faucetGeometry(width, height);
        const x = dx + faucetWidth / 2;
        const y = dy + faucetHeight / 2;
        const { width: barWidth, length: barLength } = leverDimension(width, faucetHeight);
        const bar1 = Bodies.rectangle(x, y, barWidth, barLength);
        const bar2 = Bodies.rectangle(x, y, barLength, barWidth); // same as rotate 90 deg of bar1

        const lever = Body.create({
            parts: [bar1, bar2]
        });
        const constraint = Constraint.create({
            pointA: { x, y },
            bodyB: lever,
            pointB: { x: 0, y: 0 }
        });
        this.objects.push(lever, constraint);
    }
}

export default StageObjects;
