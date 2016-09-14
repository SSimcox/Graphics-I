/**
 * Created by Steven on 9/12/2016.
 */

var gl;
var vertices = [];
var bisections = [];
var triangles = [];

var ITERATIONS = 12;

function getTriangles()
{
    var temp = [];
    for(var i = 0; i < triangles.length/3; ++i)
    {
        temp = temp.concat(getNextTriangle(i));
    }
    return temp;
}

function getNexTriangle(i)
{
    var bisectIndices;
    bisectIndices.push(getBisectIndex(i,i+1));
    bisectIndices.push(getBisectIndex(i+1,i+2));
    bisectIndices.push(getBisectIndex(i+2,i));
    return bisectIndices;
}

function getBisectIndex(i,j)
{
    if(bisections[(i, j)])
    {
        return bisections[(i,j)];
    }
    else if(bisections[(j, i)])
    {
        return bisections[(j, i)];
    }
    else
    {
        vertices.push(bisect(i,j));
        bisections[(i,j)] = bisections[(j,i)] = vertices.length - 1;
    }
}
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
    var bufferId = gl.createBuffer();

    // Set click function to change number of iterations
    document.getElementById("DCRefresh").onclick = function(){
        runDragon(textArea, bufferId); render();};

    // Execute Dragon Curve
    runDragon(textArea, bufferId);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "./shaders/vshader.glsl",
        "./shaders/fshader.glsl" );
    gl.useProgram( program );

    // Load the data into the GPU

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    // Associate out shader variables with our data buffer
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
}