import { frameThickness, ballRadius, barStandRadius, regularCenterOfMass } from './dimension.js';
import StageObjects from './stages/objects.js';
import { addScore } from './event-handler.js';
import { getConfig } from './stages/settings.js'
import Achievement from './stages/achievement.js';

let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Composite = Matter.Composite;
let Constraint = Matter.Constraint;
let Engine = Matter.Engine;
const Events = Matter.Events;
let Render = Matter.Render;
let Runner = Matter.Runner;
const World = Matter.World;

let instance;

// set concave decomposition support library
Matter.Common.setDecomp(decomp);

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
            this.stageObjectsData = {
                ornamentObjects: [undefined, undefined, undefined, undefined], // ornament objects for each leaves level
            };

            // body IDs
            this.ballId = null;

            this.initEventHandler();

            // start state
            this.started = false;
            this.checkBallIntervalId = null;

            // render resources
            this.topImg = new Image();
            this.topImg.src = 'resources/textures/xmas_top_pattern.svg';
            this.topImg.onload = () => {
                this.createTopPattern();
                this.updateTopStyle();
            }
            this.baseLImg = new Image();
            this.baseLImg.src = 'resources/textures/xmas_hat_pattern_green.svg';
            this.baseLImg.onload = () => {
                this.createBaseLPattern();
                this.updateBaseLStyle();
            }
            this.baseRImg = new Image();
            this.baseRImg.src = 'resources/textures/xmas_hat_pattern_red.svg';
            this.baseRImg.onload = () => {
                this.createBaseRPattern();
                this.updateBaseRStyle();
            }

            instance = this;
        }

        return instance;
    }

    // events handler
    initEventHandler() {
        // check parent body exists and callback function exists
        const isParentCb = (body) => {
            return body.parent && body.parent.id != body.id && body.parent.onCollisionStartCustomCb;
        }

        const runCollisionStartCb = (body) => {
            if (body.onCollisionStartCustomCb) {
                body.onCollisionStartCustomCb();
            }
            if (isParentCb(body)) {
                body.parent.onCollisionStartCustomCb();
            }
        }

        Events.on(this.engine, 'collisionStart', function (event) {
            const pairs = event.pairs;
            for (const pair of pairs) {
                if (pair.bodyA.id == instance.ballId) {
                    runCollisionStartCb(pair.bodyB);
                } else if (pair.bodyB.id == instance.ballID) {
                    runCollisionStartCb(pair.bodyA);
                }
            }
        });
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
        const frameRender = {
            fillStyle: 'rgba(0, 0, 0, 0)',
            strokeStyle: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 1,
        };
        els.push(Bodies.rectangle(frT / 2, frameOffsetH + frameLength / 2, frT, frameLength, {
            isStatic: true,
            render: frameRender,
        }));
        els.push(Bodies.rectangle(w - frT / 2, frameOffsetH + frameLength / 2, frT, frameLength, {
            isStatic: true,
            render: frameRender,
        }));

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

        this.tops = [hatPartA, hatPartB, hatPartC, hatPartD, hatPartE, hatPartF];
        els.push(hatPartA, hatPartB, hatPartC, hatPartD, hatPartE, hatPartF);
        // top pattern
        this.createTopPattern();
        this.updateTopStyle();

        // ball
        const r = ballRadius(w);
        const ballRand = Math.random();
        let ballDx = w / 2 - w / 12 + (ballRand * w / 6);
        if (ballDx <= w / 2) {
            ballDx -= r * 2;
        } else {
            ballDx += r * 2;
        }
        const ballDy = h / 2;
        const ball = Bodies.circle(ballDx, ballDy, r, {
            restitution: 1,
            render: {
                fillStyle: '#CFDAD9',
                strokeStyle: '#161D15',
                lineWidth: 2,
            },
            isStatic: true,
        });
        this.ballId = ball.id;
        this.ball = ball;
        this.ballDx = ballDx;
        this.ballDy = ballDy;
        els.push(ball);

        // base
        const baseRenderL = {
            fillStyle: 'rgba(2, 138, 15, 0.5)',
            strokeStyle: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 1,
        };
        const baseRenderR = {
            fillStyle: 'rgba(153, 15, 2, 0.5)',
            strokeStyle: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 1,
        };
        let baseSide = w / 4;
        let baseY = h - 2 * baseSide; // base starting y coordinate
        let vertices = [
            { x: frT, y: baseY },
            { x: frT, y: baseY + baseSide },
            { x: frT + baseSide, y: baseY + baseSide },
        ];
        let comL = regularCenterOfMass(vertices);
        this.baseL = Bodies.fromVertices(comL.x, comL.y, vertices, { isStatic: true, render: baseRenderL });
        els.push(this.baseL);
        let vertices2 = [
            { x: w - frT, y: baseY },
            { x: w - frT, y: baseY + baseSide },
            { x: w - frT - baseSide, y: baseY + baseSide },
        ];
        let comR = regularCenterOfMass(vertices2);
        this.baseR = Bodies.fromVertices(comR.x, comR.y, vertices2, { isStatic: true, render: baseRenderR });
        els.push(this.baseR);
        // base pattern
        this.createBaseLPattern();
        this.updateBaseLStyle();
        this.createBaseRPattern();
        this.updateBaseRStyle();

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
            length: 0,
            render: {
                strokeStyle: '#028A0F',
            },
        });
        let barRConstraint = Constraint.create({
            pointA: { x: barRX + pivotOffset, y: barY },
            pointB: { x: pivotOffset, y: 0 },
            bodyB: barR,
            length: 0,
            render: {
                strokeStyle: '#990F02',
            },
        });
        // set controllers
        this.barL = barL;
        this.barR = barR;
        this.barL.onCollisionStartCustomCb = () => {
            const stageConfig = getConfig(instance.stage);
            addScore(stageConfig.barScore);
        };
        this.barR.onCollisionStartCustomCb = () => {
            const stageConfig = getConfig(instance.stage);
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

        Composite.add(this.engine.world, els);

        this.updateStageObjects();

    }

    // create top object style pattern
    createTopPattern() {
        if (this.topImg.complete && !this.topPattern) {
            const w = 24;
            const h = 24;
            const topCanvas = document.createElement("CANVAS");
            topCanvas.width = w;
            topCanvas.height = h;
            topCanvas.getContext('2d').drawImage(this.topImg, 0, 0, w, h);
            this.topPattern = this.render.context.createPattern(topCanvas, 'repeat');
        }
    }

    // update top object style
    updateTopStyle() {
        if (this.topPattern) {
            for (const element of this.tops) {
                element.render.fillStyle = this.topPattern;
            }
        }
    }

    // create baseL object style pattern
    createBaseLPattern() {
        if (this.baseLImg.complete && !this.baseLPattern) {
            const w = 50;
            const h = 50;
            const baseLCanvas = document.createElement("CANVAS");
            baseLCanvas.width = w;
            baseLCanvas.height = h;
            baseLCanvas.getContext('2d').drawImage(this.baseLImg, 0, 0, w, h);
            this.baseLPattern = this.render.context.createPattern(baseLCanvas, 'repeat');
        }
    }

    // update baseL object style
    updateBaseLStyle() {
        if (this.baseL && this.baseLPattern) {
            this.baseL.render.fillStyle = this.baseLPattern;
        }
    }

    // create baseR object style pattern
    createBaseRPattern() {
        if (this.baseRImg.complete && !this.baseRPattern) {
            const w = 50;
            const h = 50;
            const baseRCanvas = document.createElement("CANVAS");
            baseRCanvas.width = w;
            baseRCanvas.height = h;
            baseRCanvas.getContext('2d').drawImage(this.baseRImg, 0, 0, w, h);
            this.baseRPattern = this.render.context.createPattern(baseRCanvas, 'repeat');
        }
    }

    // update baseR object style
    updateBaseRStyle() {
        if (this.baseR && this.baseRPattern) {
            this.baseR.render.fillStyle = this.baseRPattern;
        }
    }

    // return object's barL and barR
    getControlBars() {
        return {
            left: this.barL,
            right: this.barR
        }
    }

    // add or remove objects for different stgaes
    updateStageObjects() {
        const width = this.render.options.width;
        const height = this.render.options.height;
        const achievement = new Achievement();
        const stageObjs = this.stageObjects.reloadObjects(width, height, achievement.level);

        const els = [];

        if (stageObjs.leverObjects && !this.stageObjectsData.leverObjects) {
            // add new if not in main board
            els.push(...stageObjs.leverObjects);
            this.stageObjectsData.leverObjects = stageObjs.leverObjects;
        } else if (!stageObjs.leverObjects && this.stageObjectsData.leverObjects) {
            // remove from main board
            Composite.remove(this.engine.world, this.stageObjectsData.leverObjects);
        }

        // add ornament if not in main board
        // only adding is needed
        const ornamentsLen = (stageObjs.ornamentObjects && stageObjs.ornamentObjects.length) || 0;
        for (let i = 0; i < ornamentsLen; i += 1) {
            if (!this.stageObjectsData.ornamentObjects[i]) {
                els.push(...stageObjs.ornamentObjects[i]);
                this.stageObjectsData.ornamentObjects[i] = stageObjs.ornamentObjects[i];
            }
        }

        // add star if not in main board
        // only adding is needed
        if (stageObjs.starObjects && !this.stageObjectsData.starObjects) {
            els.push(...stageObjs.starObjects);
            this.stageObjectsData.starObjects = stageObjs.starObjects;
        }

        Composite.add(this.engine.world, els);
    }

    // reset ball position to init position
    resetBall() {
        Body.set(this.ball, 'position', { x: this.ballDx, y: this.ballDy });
        Body.set(this.ball, 'speed', 0);
        Body.setVelocity(this.ball, { x: 0, y: 0 });
    }

    // start by unsetting ball to not static 
    start() {
        Body.setStatic(this.ball, false);
        this.started = true;
        this.setCheckBallInterval();
    }

    // stop by setting ball to static 
    stop() {
        Body.setStatic(this.ball, true);
        this.started = false;
        if (this.checkBallIntervalId != null) {
            clearInterval(this.checkBallIntervalId);
            this.checkBallIntervalId = null;
        }
    }

    // check ball position, speed or other state and call handler
    setCheckBallInterval() {
        if (this.checkBallIntervalId == null) {
            this.checkBallIntervalId = setInterval(() => {
                if (instance.ball && instance.started) {
                    if (instance.ball.position.y > instance.render.options.height) {
                        // emit stop game event
                        window.dispatchEvent(new Event('customStop'));
                    } else if (instance.ball.position.x < 0 ||
                        instance.ball.position.x > instance.render.options.width ||
                        instance.ball.position.y < 0) {
                        // ball may penetrate through top or sides,
                        // feature: hard set the ball to starting position
                        instance.resetBall();
                    }
                }
            }, 1000);
        }
    }

    // cleanup 
    clear() {
        // clear stages objects also
        this.stageObjects.clear();

        Render.stop(this.render);
        World.clear(this.engine.world);
        Engine.clear(this.engine);

        this.render.canvas.remove();
        this.render.canvas = null;
        this.render.context = null;
        this.render.textures = {};

        instance = null;
    }
}

export default MatterObject;
