import { getConfig } from './settings.js'
import { faucetGeometry, leverDimension, ornamentRadius, leavesGeometry } from '../dimension.js';
import { turnFaucet } from '../event-handler.js';

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
            this.objects = {};

            instance = this;
        }
        return instance;
    }

    reloadObjects(width, height, stage = 0) {
        this.objects = {};
        this.stage = stage;

        // get stage render config
        const stageConfig = getConfig(stage);

        if (stageConfig.faucet) {
            this.objects.leverObjects = this.loadLever(width, height);
        }

        if (stageConfig.leavesMax > 0) {
            this.objects.ornamentObjects = [undefined, undefined, undefined, undefined];
            for (let i = 0; i < stageConfig.leavesMax; i += 1) {
                this.objects.ornamentObjects[i] = this.loadOrnament(width, height, i);
            }
        }

        return this.objects;
    }

    /// lever 
    /// 2 rectangles to form + shape
    /// 4 circles at rect's both ends
    loadLever(width, height) {
        const { dx, dy, width: faucetWidth, height: faucetHeight } = faucetGeometry(width, height);
        const x = dx + faucetWidth / 2;
        const y = dy + faucetHeight / 2;
        const { width: barWidth, length: barLength } = leverDimension(width, faucetHeight);

        let render = {
            fillStyle: '#CFD4D9',
            strokeStyle: '#D7D7D7',
            lineWidth: 1,
        };
        const bar1 = Bodies.rectangle(x, y, barWidth, barLength, { render });
        const bar2 = Bodies.rectangle(x, y, barLength, barWidth, { render }); // same as rotate 90 deg of bar1
        const r = barWidth * 1.2;
        const bar1Circle1 = Bodies.circle(x + barLength / 2 + r, y, r, { render });
        const bar1Circle2 = Bodies.circle(x - barLength / 2 - r, y, r, { render });
        const bar2Circle1 = Bodies.circle(x, y + barLength / 2 + r, r, { render });
        render = {
            fillStyle: '#F5D259',
            strokeStyle: '#D7D7D7',
            lineWidth: 1,
        };
        const bar2Circle2 = Bodies.circle(x, y - barLength / 2 - r, r, { render });

        const lever = Body.create({
            parts: [bar1, bar2, bar1Circle1, bar1Circle2, bar2Circle1, bar2Circle2]
        });
        lever.onCollisionStartCustomCb = () => {
            const stageConfig = getConfig(instance.stage);
            turnFaucet(stageConfig.faucetScore);
        }
        const constraint = Constraint.create({
            pointA: { x, y },
            bodyB: lever,
            pointB: { x: 0, y: 0 }
        });
        return [lever, constraint];
    }

    /// ornament for each leaves level
    loadOrnament(width, height, leavesLevel) {
        const r = ornamentRadius(width);
        const { dy: lDy, width: lWidth, height: lHeight } = leavesGeometry(width, height, leavesLevel);
        const dx = width / 2 - lWidth / 2 + Math.random() * lWidth / 2;
        const dy = lDy + lHeight * 4 / 5;

        const ornament = Bodies.polygon(dx, dy, r, 4);
        const constraint = Contraint.create({
            pointA: { x: dx, y: dy - r - 8 }, // hang point
            bodyB: ornament,
            pointB: { x: 0, y: 0 },
            stiffness: 0.001,
            damping: 0.05,
        });
        return [ornament, constraint];
    }
}

export default StageObjects;
