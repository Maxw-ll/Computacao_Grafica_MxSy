let gl;

let objects = [
    {
        name: "triangulo",
        color: [1.0, 0.2, 0.2, 1.0],
        selectedColor: [1.0, 1.0, 0.0, 1.0],
        vertices: [
            vec2(0, 0.15),
            vec2(-0.15, -0.15),
            vec2(0.15, -0.15)
        ],
        transform: mat4(),
        selected: false,
        translation: vec2(0,0),
        rotation: 0,
        scale: vec2(1,1),
    },
    {
        name: "quadrado",
        color: [0.2, 0.6, 1.0, 1.0],
        selectedColor: [1.0, 1.0, 0.0, 1.0],
        vertices: [
            vec2(-0.20, 0.20),
            vec2(0.20, 0.20),
            vec2(0.20, -0.20),
            vec2(-0.20, -0.20)
        ],
        transform: mat4(),
        selected: false,
        translation: vec2(0,0),
        rotation: 0,
        scale: vec2(1,1),
    }
];

let mode = "translate";
let dragging = false;
let selectedObj = null;
let lastMouse = null;

window.onload = function () {
    const canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vPosition = gl.getAttribLocation(program, "vPosition");
    transformLoc = gl.getUniformLocation(program, "transform");
    colorLoc = gl.getUniformLocation(program, "vColor");

    setupMouse(canvas);
    render();
};

// -----------------------------------------------------------
// FUNÇÃO DE PICKING REAL (ray → objeto → teste poligonal)
// -----------------------------------------------------------
function rebuildMatrix(obj) {
    let M = mat4();
    M = mult(M, translate(obj.translation[0], obj.translation[1], 0));
    M = mult(M, rotate(obj.rotation, [0,0,1]));
    M = mult(M, scalem(obj.scale[0], obj.scale[1], 1));
    return M;
}


function pick(x, y) {
    let cx = (2 * x / gl.canvas.width) - 1;
    let cy = 1 - 2 * (y / gl.canvas.height);


    selectedObj = null;

    
    
    for (let obj of objects) {
    function applyInverse(mat, point) {
    let inv = inverse(mat);

    let x = point[0], y = point[1];

    let xp = inv[0][0] * x + inv[0][1] * y + inv[0][3];
    let yp = inv[1][0] * x + inv[1][1] * y + inv[1][3];

    return [xp, yp];
}

let point = applyInverse(obj.transform, [cx, cy]);

        
        if (pointInPolygon(point, obj.vertices)) {
            obj.selected = true;
            selectedObj = obj;
        } else {
            obj.selected = false;
        }
    }
    console.log("Picking:", cx, cy);
    console.log("Selected:", selectedObj?.name || "none");
}

// Teste ponto em polígono (Ray casting)
function pointInPolygon(point, verts) {
    let [x, y] = point;
    let inside = false;

    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
        let xi = verts[i][0], yi = verts[i][1];
        let xj = verts[j][0], yj = verts[j][1];

        let intersect =
            (yi > y) !== (yj > y) &&
            x < (xj - xi) * (y - yi) / ((yj - yi) || 0.00001) + xi;

        if (intersect) inside = !inside;
    }
    return inside;
}

// -----------------------------------------------------------
// MOUSE INTERAÇÃO
// -----------------------------------------------------------

function getObjectCenter(obj) {
    let sumX = 0, sumY = 0;

    for (let v of obj.vertices) {
        // aplica transformação atual sobre cada vértice
        let p = mult(obj.transform, vec4(v[0], v[1], 0, 1));
        sumX += p[0];
        sumY += p[1];
    }

    return [sumX / obj.vertices.length, sumY / obj.vertices.length];
}



function setupMouse(canvas) {
    canvas.onmousedown = (e) => {
        console.log("click", e.offsetX, e.offsetY);

        pick(e.offsetX, e.offsetY);
        if (selectedObj) {
            dragging = true;
            lastMouse = { x: e.offsetX, y: e.offsetY };
        }
    };

    canvas.onmouseup = () => dragging = false;

    canvas.onmousemove = (e) => {
        if (!dragging || !selectedObj) return;

        let dx_pixels = e.offsetX - lastMouse.x;
        let dy_pixels = e.offsetY - lastMouse.y;

        let dx = (dx_pixels / gl.canvas.width) * 2;
        let dy = -(dy_pixels / gl.canvas.height) * 2;


        obj = selectedObj

        if (mode === "translate") {
            obj.translation[0] += dx;
            obj.translation[1] += dy;
            obj.transform = rebuildMatrix(obj);
        }

        if (mode === "rotate") {
            obj.rotation += dx * 200;   // suavidade
            obj.transform = rebuildMatrix(obj);
        }


        if (mode === "scale") {
            let s = 1 + dx;
            obj.scale[0] *= s;
            obj.scale[1] *= s;
            obj.transform = rebuildMatrix(obj);
        }

        lastMouse = { x: e.offsetX, y: e.offsetY };
    };
}

function setMode(m) {
    mode = m;
}

// -----------------------------------------------------------
// RENDER
// -----------------------------------------------------------

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let obj of objects) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.vertices), gl.STATIC_DRAW);

        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.uniformMatrix4fv(transformLoc, false, flatten(obj.transform));

        gl.uniform4fv(colorLoc, new Float32Array(obj.selected ? obj.selectedColor : obj.color));

        gl.drawArrays(gl.TRIANGLE_FAN, 0, obj.vertices.length);
    }

    requestAnimFrame(render);
}

window.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();

    if (key === "t") {
        setMode("translate");
        console.log("Modo: Translação (T)");
    }
    if (key === "r") {
        setMode("rotate");
        console.log("Modo: Rotação (R)");
    }
    if (key === "e") {
        setMode("scale");
        console.log("Modo: Escala (E)");
    }
});

