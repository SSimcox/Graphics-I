/**
 * Created by Steven on 9/9/2016.
 */

var gl;

var direction = 0;

/// APPLICATION ENTRY POINT ///
window.onload = function init()
{
    // Retrieve HTML elements
    var canvas = document.getElementById( "gl-canvas" );
    var textArea = document.getElementById("DCIterations");
    // var directionArea = document.getElementById("DCDirection");

    // Initialize gl
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );}
    // Initialize bufferId for vertices

    genPaths();
    generateVertices();
    createWalls();

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "./shaders/vshader.glsl",
        "./shaders/fshader.glsl" );
    gl.useProgram( program );
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(wallIndex)), gl.STATIC_DRAW);
    // Associate our shader variables with our data buffer
    var viewTransform = gl.getUniformLocation(program, "transform");

    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 3, gl.FLOAT, false, 12, 0 );
    gl.enableVertexAttribArray( vPos );

    var vCol = gl.getAttribLocation( program, "myColor" );
    gl.vertexAttribPointer( vCol, 3, gl.FLOAT, false, 12, 12 );
    gl.enableVertexAttribArray( vCol );

    render(viewTransform);
};

function render(viewTransform)
{
    var pers = perspective(60,1,1.000001,5);
    var look = lookAt(vec3(.5,.5,1),vec3(.5,.5,-1.0),vec3(0,1,0));
    var transform = mult(pers,look);
    var identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    gl.uniformMatrix4fv(viewTransform, false, flatten(transform));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, wallIndex.length ,gl.UNSIGNED_SHORT,0);
}