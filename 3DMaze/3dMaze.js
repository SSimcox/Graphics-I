/**
 * Created by Steven on 9/9/2016.
 */

var gl;
var bufferId;
var indicesBuffer;
var viewTransform;
var dimension = 9;

var s = .1;
var scaleMatrix = mat3(s,0,0,0,s,0,0,0,s);

// First Person
var lookAtDegree = -90;
var loc = vec3(.5,.5,.5);
var dest = add(loc, vec3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))));
var up = vec3(0,1,0);

// Bird's eye
var otherLoc = vec3(5.5,5,5);
var otherDest = vec3(5.5,.5,-5);
var otherUp = vec3(0,1,-1);

var beginToggled = true;

var fp = false;
var keys = [false,false,false,false];

function toggleView(){
    var tempLoc = otherLoc;
    var tempDest = otherDest;
    var tempUp = otherUp;
    otherLoc = loc;
    otherDest = dest;
    otherUp = up;
    loc = tempLoc;
    dest = tempDest;
    up = tempUp;
    fp = !fp;
    console.log(fp);
}

function runMaze(textArea){
    dimension = Number(textArea.value);

    loc = vec3(.5,.5,.5);
    dest = add(loc, vec3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))));
    up = vec3(0,1,0);

// Bird's eye
    otherLoc = vec3(dimension / 2,5,5);
    otherDest = vec3(dimension / 2,.5,-5);
    otherUp = vec3(0,1,-1);

    if(!fp) {
        beginToggled = true;
        fp = ! fp;
    }
    else{
        beginToggled = false;
    }
    genPaths();
    generateVertices();
    createWalls();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(wallIndex)), gl.STATIC_DRAW);

    if(beginToggled)
        toggleView();
}

/// APPLICATION ENTRY POINT ///
window.onload = function init()
{
    // Retrieve HTML elements
    var canvas = document.getElementById( "gl-canvas" );
    var textArea = document.getElementById("MazeCells");
    var toggleViewButton = document.getElementById("toggle-bird");
    var refreshButton = document.getElementById("MazeRemake");
    toggleViewButton.addEventListener("click", toggleView);
    refreshButton.addEventListener("click", function (){runMaze(textArea)});
    // var directionArea = document.getElementById("DCDirection");

    // Initialize gl
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );}
    // Initialize bufferId for vertices
    bufferId = gl.createBuffer();
    indicesBuffer = gl.createBuffer();
    runMaze(textArea);

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



    // Associate our shader variables with our data buffer
    viewTransform = gl.getUniformLocation(program, "transform");

    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 3, gl.FLOAT, false, 12, 0 );
    gl.enableVertexAttribArray( vPos );

    var vCol = gl.getAttribLocation( program, "myColor" );
    gl.vertexAttribPointer( vCol, 3, gl.FLOAT, false, 12, 12 );
    gl.enableVertexAttribArray( vCol );

    window.onkeydown = press;
    window.onkeyup = unPress;
    render();
};


function press(event)
{
    console.log("Press");
    console.log(event.keyCode);
    if (event.keyCode === 37) {
        keys[0] = true;
    }
    else if(event.keyCode === 38)
        keys[1] = true;
    else if(event.keyCode === 39){
        keys[2] = true;
    }
    else if(event.keyCode === 40)
        keys[3] = true;
    console.log(keys);
}

function unPress(event)
{
    console.log("Unpress");
    if (event.keyCode === 37) {
        keys[0] = false;
    }
    else if(event.keyCode === 38)
        keys[1] = false;
    else if(event.keyCode === 39){
        keys[2] = false;
    }
    else if(event.keyCode === 40)
        keys[3] = false;
}

function turn(dir)
{
    var i = dir === "left" ? -1:1;
    console.log("Turn");
    if(fp)
        dest = add(loc, vec3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))));
    else{
        dest = add(dest, vec3(i,0,0));
        loc = add(loc, vec3(i,0,0));
    }
}

function move(val)
{
    console.log("Move");
    if(val < 0) {
        loc = subtract(loc, mult(scaleMatrix,mat3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))))[0]);
        console.log(loc);
    }
    else {
        loc = add(loc, mult(scaleMatrix,mat3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))))[0]);
        console.log(loc);
    }
    if(fp)
        turn();
}

function render()
{
    if (keys[0]) {
        if(fp) lookAtDegree--;
        turn("left");
        console.log("keys[0]");
    }
    else if(keys[1])
        move(1);
    else if(keys[2]){
        if(fp)lookAtDegree++;
        turn();
    }
    else if(keys[3])
        move(-1);

    // First person
    var pers = perspective(45,1,0.001, 20);
    var look = lookAt(loc, dest, up);
    // var identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    var transform = mult(pers,look);
    gl.uniformMatrix4fv(viewTransform, false, flatten(transform));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, wallIndex.length ,gl.UNSIGNED_SHORT,0);

    requestAnimFrame(render);
}