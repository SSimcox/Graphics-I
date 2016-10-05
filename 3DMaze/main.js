/**
 * Created by Steven on 10/4/2016.
 */


var vPos, vCol;
var gl;
var bufferId;
var indicesBuffer;
var viewTransform;

var currentCell;

function setGLVars(){
    // Buffers
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(wallIndex)), gl.STATIC_DRAW);
    // Position vertices
    gl.vertexAttribPointer( vPos, 3, gl.FLOAT, false, 12, 0 );
    gl.enableVertexAttribArray( vPos );

    // Color vertices
    gl.vertexAttribPointer( vCol, 3, gl.FLOAT, false, 12, 12 );
    gl.enableVertexAttribArray( vCol );
}

/// APPLICATION ENTRY POINT ///
window.onload = function init()
{
    // Retrieve HTML elements
    var canvas = document.getElementById( "gl-canvas" );
    var textArea = document.getElementById("MazeCells");
    var toggleViewButton = document.getElementById("toggle-bird");
    var refreshButton = document.getElementById("MazeRemake");
    currentCell = document.getElementById("current-cell");
    toggleViewButton.addEventListener("click", toggleView);
    refreshButton.addEventListener("click", function (){runMaze(textArea)});
    //--------------
    // Initialize gl
    //--------------
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );}
    //-----------------------------------------------
    //  Load shaders and initialize attribute buffers
    //-----------------------------------------------
    var program = initShaders( gl, "./shaders/vshader.glsl",
        "./shaders/fshader.glsl" );
    //---------------------------------
    // Initialize bufferId for vertices
    //---------------------------------
    bufferId = gl.createBuffer();
    indicesBuffer = gl.createBuffer();
    //----------------------------------------------------
    // Associate our shader variables with our data buffer
    //----------------------------------------------------
    viewTransform = gl.getUniformLocation(program, "transform");
    vPos = gl.getAttribLocation( program, "vPosition" );
    vCol = gl.getAttribLocation( program, "myColor" );
    //---------------
    // Run Algorithms
    //---------------
    runMaze(textArea);
    //-----------------
    //  Configure WebGL
    //-----------------
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.6, 0.8, 1.0, 1.0 ); // Grey-ish Blue background
    gl.useProgram( program );
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);

    window.onkeydown = press;
    window.onkeyup = unPress;
    render();
};
