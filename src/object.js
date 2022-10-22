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
}

export default MatterObject;
