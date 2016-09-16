/**
 * Created by Steven on 9/9/2016.
 */

var gl;
var vertices = [];

var ITERATIONS = 12;
var direction = 0;

//Gets Next string of dragon curve
function iterateString(input, x1, r1, x2, r2)
{
    var temp = "";
    for(var i = 0; i < input.length; ++i)
    {
        switch(input[i]){
            case x1: temp += r1;
                break;
            case x2: temp += r2;
                break;
            default: temp += input[i];
        }
    }
    return temp;
}

//Creates vertices from string
function walkInput(input, length)
{
    var vertices = [];
    direction = ((((Math.floor(ITERATIONS/2) % 4) - 4) * -1) + 1) % 4;// 0 = right, 1 = down, 2 = left, 3 = up
    vertices.push(vec2(-.5,0));
    for(var i = 0; i < input.length; ++i)
    {
        if(input[i] == "f")
        {
            var currentPoint = vertices[vertices.length-1];
            var whichWay;
            if(direction == 0) whichWay = vec2(length,0);
            else if(direction == 1) whichWay = vec2(0, length * -1);
            else if(direction == 2) whichWay = vec2(length * -1, 0);
            else if(direction == 3) whichWay = vec2(0, length);
            var newPoint = add(currentPoint, whichWay);
            vertices.push(newPoint);
        }
        else if(input[i] == "+")
        {
            direction = direction + 1;
            if(direction > 3) direction = 0;
        }
        else
        {
            direction = direction - 1;
            if(direction < 0) direction = 3;
        }
    }
    return vertices;
}

// Runs both iterate and walk and resends the vertices to gpu
function runDragon(textArea, bufferId)
{
    ITERATIONS = Number(textArea.value);
    //direction = Number(directionArea.value);
    // Length of each step in the curve
    var length = Math.pow(1/Math.sqrt(2), ITERATIONS);
    // Starting string
    var start = "fx";
    // Replacement strings
    var xReplace = "x+yf+";
    var yReplace = "-fx-y";
    //
    // Iterate The string
    //
    var output = start;
    for(var i = 0; i < ITERATIONS; ++i)
        output = iterateString(output, 'x', xReplace, "y", yReplace);

    vertices = walkInput(output, length);
    // Reset the vertices on the GPU
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
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
    console.log(vertices.length);
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
}