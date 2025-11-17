
var canvas;
var gl;

// Variáveis de projeção
var fovy = 45.0;
var aspect;
var near = 0.1;
var far = 10.0;


// Variaveis de câmera
var eye = vec3(4.0, -4.0, 4.0)
var at = vec3(0.0, 0.0, 0.0)
var up = vec3(0.0, -1.0, 0.0)


// Posição inicial da câmera

// Matrizes de transformação
var modelViewMatrix, modelViewMatrixLoc;
var projectionMatrix, projectionMatrixLoc;

var vertices = [
    vec3( 0.5, 0.5, 0.5 ),
    vec3( -0.5, 0.5, 0.5 ),
    vec3( -0.5, -0.5, 0.5 ),
    vec3( 0.5, -0.5, 0.5 ),
    vec3( 0.5, 0.5, -0.5 ),
    vec3( -0.5, 0.5, -0.5 ),    
    vec3( -0.5, -0.5, -0.5 ),
    vec3( 0.5, -0.5, -0.5 )
];

var faces = [
    [0, 1, 2, 3],
    [4, 7, 6, 5],
    [0, 4, 5, 1],
    [1, 5, 6, 2],
    [2, 6, 7, 3],
    [3, 7, 4, 0]
];

var colors = [
    [ 1.0, 0.0, 0.0, 1.0 ],  
    [ 0.0, 1.0, 0.0, 1.0 ],  
    [ 0.0, 0.0, 1.0, 1.0 ], 
    [ 1.0, 1.0, 0.0, 1.0 ],  
    [ 0.0, 1.0, 1.0, 1.0 ], 
    [ 1.0, 0.0, 1.0, 1.0 ]  
];

var vs_vertices = [];
var vs_colors = [];

function create_cube(){
    for(var f=0; f<faces.length; f++){
        var a = vertices[faces[f][0]]
        var b = vertices[faces[f][1]]
        var c = vertices[faces[f][2]]
        var d = vertices[faces[f][3]]

        vs_vertices.push(a)
        vs_vertices.push(b)
        vs_vertices.push(c)

        vs_vertices.push(c)
        vs_vertices.push(d)
        vs_vertices.push(a)

        for(var i=0; i<6; i++)
            vs_colors.push(colors[f])
        
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    aspect = canvas.width / canvas.height;

    //Criar o cubo
    create_cube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Linka e compila os shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Vértices
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vs_vertices), gl.STATIC_DRAW );    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    //Cores
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vs_colors), gl.STATIC_DRAW );    

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Matrizes de transformação
    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten (modelViewMatrix));
    
    projectionMatrix = perspective(fovy, aspect, near, far);
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten (projectionMatrix));

        
    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.TRIANGLES, 0, vs_vertices.length );
    requestAnimFrame(render);
}


