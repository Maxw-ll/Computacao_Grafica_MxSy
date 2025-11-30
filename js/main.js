window.onload = () => {

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
