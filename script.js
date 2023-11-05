import { WebGLUtility, ShaderProgram } from "./lib/webgl.js";

console.log('GLSL_001');

window.addEventListener('DOMContentLoaded', async () => {
    const app = new WebGLApp();
    window.addEventListener('resize', app.resize, false);
    app.init('webgl-canvas');
    await app.load();
    app.setup();
    app.render();
}, false);

class WebGLApp {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.running = false;

        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);

        this.uAngle = Math.PI / 180.0;
    };

    init(canvas, option = {}) {
        if (canvas instanceof HTMLCanvasElement === true) {
            this.canvas = canvas;
        } else if (Object.prototype.toString.call(canvas) === '[object String]') {
            const c = document.querySelector(`#${canvas}`);
            if (c instanceof HTMLCanvasElement === true) {
                this.canvas = c;
            };
        };

        if (this.canvas == null) {
            throw new Error('invalid argument');
        };

        this.gl = this.canvas.getContext('webgl', option);
        if (this.gl == null) {
            throw new Error('webgl not supported');
        };
    };

    async load() {
        const vs = await WebGLUtility.loadFile('./main.vert');
        const fs = await WebGLUtility.loadFile('./main.frag');

        this.shaderProgram = new ShaderProgram(this.gl, {
            vertexShaderSource: vs,
            fragmentShaderSource: fs,
            attribute: [
                'position',
                'color',
                'size',
            ],
            stride: [
                3,
                4,
                1,
            ],
            uniform: [
                'pointAngle',
            ],
            type: [
                'uniform1f',
            ],
        });
    };

    setup() {
        this.setupGeometry();
        this.resize();
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.running = true;
    };

    setupGeometry() {
        this.position = [];
        this.color = [];
        this.size = [];

        for (let i = 0.1; i < 1; i += 0.1) {
            for (let j = 0; j < 720; j++) {
                const x = i;
                const y = ((j + 90) * Math.PI / 180);
                const z = ((j * 2) * Math.PI / 180);
                this.position.push(x, y, z);

                if (j / 720 < 0.5) {
                    this.color.push(j / 720 * 2, 1.0, j / 720 * 2, 1.0);
                } else {
                    this.color.push(1 - (j / 720 - 0.5) * 2, 1.0, 1 - (j / 720 - 0.5), 1.0);
                };
                this.size.push(i * 5.0);
            };
        };

        this.vbo = [
            WebGLUtility.createVbo(this.gl, this.position),
            WebGLUtility.createVbo(this.gl, this.color),
            WebGLUtility.createVbo(this.gl, this.size),
        ];
    };

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

    render() {
        const gl = this.gl;
        this.uAngle += Math.PI / 120;

        if (this.running === true) {
            requestAnimationFrame(this.render);
        };

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.shaderProgram.use();
        this.shaderProgram.setAttribute(this.vbo);
        this.shaderProgram.setUniform([
            this.uAngle,
        ]);
        gl.drawArrays(gl.POINTS, 0, this.position.length / 3);
    };
};