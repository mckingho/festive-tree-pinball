import { frameThickness, ballRadius, barStandRadius, regularCenterOfMass } from './dimension.js';
import StageObjects from './stages/objects.js';
import { addScore } from './event-handler.js';
import { getConfig } from './stages/settings.js'

let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Composite = Matter.Composite;
let Constraint = Matter.Constraint;
let Engine = Matter.Engine;
const Events = Matter.Events;
let Render = Matter.Render;
let Runner = Matter.Runner;

let instance;

class MatterObject {
    constructor(renderElement, width, height) {
        if (!instance) {
            // create an engine
            this.engine = Engine.create();

            // create a renderer
            this.render = Render.create({
                element: renderElement,
                engine: this.engine,
                options: {
                    width,
                    height,
                    wireframes: false,
                    background: 'transparent',
                }
            });

            // run the renderer
            Render.run(this.render);

            // create runner
            this.runner = Runner.create();

            // run the engine
            Runner.run(this.runner, this.engine);

            // include stages objects
            this.stageObjects = new StageObjects();

            // body IDs
            this.ballId = null;

            // events handler
            Events.on(this.engine, 'collisionStart', function (event) {
                const pairs = event.pairs;
                for (var i = 0; i < pairs.length; i++) {
                    const pair = pairs[i];
                    if (pair.bodyA.id == instance.ballId && pair.bodyB.onCollisionStartCustomCb) {
                        pair.bodyB.onCollisionStartCustomCb();
                    } else if (pair.bodyB.id == instance.ballID && pair.bodyA.onCollisionStartCustomCb) {
                        pair.bodyA.onCollisionStartCustomCb();
                    }
                }
            });

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        this.render.bounds.max.x = width;
        this.render.bounds.max.y = height;
        this.render.options.width = width;
        this.render.options.height = height;
        this.render.canvas.width = width;
        this.render.canvas.height = height;
    }

    buildEngine() {
        let keepStatic = false;
        Composite.clear(this.engine.world, keepStatic);

        let w = this.render.options.width;
        let h = this.render.options.height;

        let els = [];

        // frame
        let frT = frameThickness(w);
        // left, right, bottom of frame 
        let frameOffsetH = h / 4;
        let frameLength = h - frameOffsetH;
        els.push(Bodies.rectangle(frT / 2, frameOffsetH + frameLength / 2, frT, frameLength, { isStatic: true }));
        els.push(Bodies.rectangle(w - frT / 2, frameOffsetH + frameLength / 2, frT, frameLength, { isStatic: true }));
        els.push(Bodies.rectangle(w / 2, h - frT / 2, w - frT * 2, frT, { isStatic: true }));

        // top hat
        let hatFrameRender = {
            fillStyle: '#D21404',
        };
        // left of hat
        // Position:
        // - Part C
        // - Part B
        // - Part A
        let hatPartH = h / 12;
        let hatPartALength = hatPartH / 0.92; // cos 22.5deg
        let hatPartA = Bodies.rectangle(frT / 2, hatPartH * 3 - hatPartALength / 2, frT, hatPartALength, { isStatic: true, render: hatFrameRender });
        Body.rotate(hatPartA, Math.PI / 8, { x: hatPartA.position.x + frT / 2, y: hatPartA.position.y + hatPartALength / 2 });
        // find connecting point of part B from part A
        let hatPartBX = frT + hatPartALength * 0.38; // sin 22.5deg
        hatPartBX = hatPartBX - frT * 0.92; // sin 67.5deg
        let hatPartBY = hatPartH * 3 - hatPartALength * 0.92; // cos 22.5deg
        hatPartBY = hatPartBY - frT * 0.38; // cos 67.5deg
        let hatPartBLength = hatPartH / 0.71; // cos 45deg
        let hatPartB = Bodies.rectangle(hatPartBX + frT / 2, hatPartBY - hatPartBLength / 2, frT, hatPartBLength, { isStatic: true, render: hatFrameRender });
        Body.rotate(hatPartB, Math.PI / 4, { x: hatPartB.position.x - frT / 2, y: hatPartB.position.y + hatPartBLength / 2 });
        // find connecting point of part C from part B
        let hatPartCX = hatPartBX + hatPartBLength * 0.71; // sin 45deg
        let hatPartCY = hatPartBY - hatPartBLength * 0.71; // cos 45deg
        let hatPartCLength = Math.sqrt(Math.pow(hatPartCX - w, 2) + Math.pow(hatPartCY, 2));
        let hatPartCRadian = Math.atan((w - hatPartCX) / hatPartCY);
        let hatPartC = Bodies.rectangle(hatPartCX + frT / 2, hatPartCY - hatPartCLength / 2, frT, hatPartCLength, { isStatic: true, render: hatFrameRender });
        Body.rotate(hatPartC, hatPartCRadian, { x: hatPartC.position.x - frT / 2, y: hatPartC.position.y + hatPartCLength / 2 });
        // right of hat
        // Position:
        // - Part F
        // - Part E
        // - Part D
        let hatPartDLength = hatPartALength;
        let hatPartD = Bodies.rectangle(w - frT / 2, hatPartH * 3 - hatPartDLength / 2, frT, hatPartDLength, { isStatic: true, render: hatFrameRender });
        Body.rotate(hatPartD, -Math.PI / 8, { x: hatPartD.position.x - frT / 2, y: hatPartD.position.y + hatPartALength / 2 });
        // find connecting point of part E from part D
        let hatPartEX = w - frT - hatPartDLength * 0.38; // sin 22.5deg
        let hatPartEY = hatPartH * 3 - hatPartDLength * 0.92; // cos 22.5deg
        let hatPartE = Bodies.rectangle(hatPartEX + frT / 2, hatPartEY - hatPartH / 2, frT, hatPartH, { isStatic: true, render: hatFrameRender });
        // find connecting point of part F from part E
        let hatPartFX = hatPartEX;
        let hatPartFY = hatPartEY - hatPartH;
        let hatPartFLength = Math.sqrt(Math.pow(hatPartFX - w, 2) + Math.pow(hatPartFY, 2));
        let hatPartFRadian = Math.atan((w - hatPartFX) / hatPartFY);
        let hatPartF = Bodies.rectangle(hatPartFX + frT / 2, hatPartFY - hatPartFLength / 2, frT, hatPartFLength, { isStatic: true, render: hatFrameRender });
        Body.rotate(hatPartF, hatPartFRadian, { x: hatPartF.position.x - frT / 2, y: hatPartF.position.y + hatPartFLength / 2 });

        els.push(hatPartA, hatPartB, hatPartC, hatPartD, hatPartE, hatPartF);

        // ball
        let r = ballRadius(w);
        const ball = Bodies.circle(150, 150, r, {
            restitution: 1,
            render: {
                fillStyle: '#ECECEC',
                strokeStyle: '#D7D7D7',
                lineWidth: 1,
            }
        });
        this.ballId = ball.id;
        els.push(ball);

        // base
        let baseSide = w / 4;
        let baseY = h - 2 * baseSide; // base starting y coordinate
        let vertices = [
            { x: frT, y: baseY },
            { x: frT, y: baseY + baseSide },
            { x: frT + baseSide, y: baseY + baseSide },
        ];
        let comL = regularCenterOfMass(vertices);
        els.push(Bodies.fromVertices(comL.x, comL.y, vertices, { isStatic: true }));
        let vertices2 = [
            { x: w - frT, y: baseY },
            { x: w - frT, y: baseY + baseSide },
            { x: w - frT - baseSide, y: baseY + baseSide },
        ];
        let comR = regularCenterOfMass(vertices2);
        els.push(Bodies.fromVertices(comR.x, comR.y, vertices2, { isStatic: true }));

        // bars
        let barRenderL = {
            fillStyle: '#03AC13',
            strokeStyle: '#028A0F',
            lineWidth: 1,
        };
        let barRenderR = {
            fillStyle: '#D21404',
            strokeStyle: '#990F02',
            lineWidth: 1,
        };
        let barSide = w / 4;
        let barT = frT; // bar thickness
        let barLX = baseSide + barSide / 2 - r;
        let barY = baseY + baseSide + barT;
        let barL = Bodies.rectangle(barLX, barY, barSide, barT, {
            chamfer: 4,
            render: barRenderL,
        });
        let barRX = w - baseSide - barSide / 2 + r;
        let barR = Bodies.rectangle(barRX, barY, barSide, barT, {
            chamfer: 4,
            render: barRenderR,
        });
        let pivotOffset = barSide / 4;
        let barLConstraint = Constraint.create({
            pointA: { x: barLX - pivotOffset, y: barY },
            pointB: { x: -pivotOffset, y: 0 },
            bodyB: barL,
            length: 0
        });
        let barRConstraint = Constraint.create({
            pointA: { x: barRX + pivotOffset, y: barY },
            pointB: { x: pivotOffset, y: 0 },
            bodyB: barR,
            length: 0
        });
        // set controllers
        this.barL = barL;
        this.barR = barR;
        this.barL.onCollisionStartCustomCb = () => {
            const stageConfig = getConfig(this.stage);
            addScore(stageConfig.barScore);
        };
        this.barR.onCollisionStartCustomCb = () => {
            const stageConfig = getConfig(this.stage);
            addScore(stageConfig.barScore);
        };
        // bar stands
        const standRadius = barStandRadius(w);
        let standDist = pivotOffset;
        let standLX = barLX;
        let standY = barY + standDist;
        let standRX = barRX;
        let standL = Bodies.circle(standLX, standY, standRadius, {
            isStatic: true,
            render: barRenderL,
        });
        let standR = Bodies.circle(standRX, standY, standRadius, {
            isStatic: true,
            render: barRenderR,
        });
        els.push(barL, barLConstraint, standL, barR, barRConstraint, standR);

        // add stages objects
        const stageObjs = this.stageObjects.reloadObjects(w, h);
        els.push(...stageObjs);

        Composite.add(this.engine.world, els);
    }

    // return object's barL and barR
    getControlBars() {
        return {
            left: this.barL,
            right: this.barR
        }
    }
}

export default MatterObject;
