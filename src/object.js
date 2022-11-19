import { frameThickness, ballRadius } from './dimension.js';

let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Composite = Matter.Composite;
let Constraint = Matter.Constraint;
let Engine = Matter.Engine;
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
                    wireframeBackground: 'transparent',
                }
            });

            // run the renderer
            Render.run(this.render);

            // create runner
            this.runner = Runner.create();

            // run the engine
            Runner.run(this.runner, this.engine);

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
        // left, top, right, bottom of frame 
        els.push(Bodies.rectangle(frT / 2, h / 2, frT, h - frT * 2, { isStatic: true }));
        els.push(Bodies.rectangle(w / 2, frT / 2, w - frT * 2, frT, { isStatic: true }));
        els.push(Bodies.rectangle(w - frT / 2, h / 2, frT, h - frT * 2, { isStatic: true }));
        els.push(Bodies.rectangle(w / 2, h - frT / 2, w - frT * 2, frT, { isStatic: true }));

        // ball
        let r = ballRadius(w);
        els.push(Bodies.circle(50, 50, r, { restitution: 1 }));

        Composite.add(this.engine.world, els);
    }
}

export default MatterObject;
