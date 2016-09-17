/**
 * Created by Steven on 9/12/2016.
 */

var gl;
var vertices = [];
var bisections = [];
var triangles = [];
var theta = 0;
var rotationLoc;

var startVertices = [
    vec3(   0, .75, 0),//top
    vec3(-.75,-.75, 0),//left
    vec3(   0,   -.75,  .75),//front
    vec3( .75,-.75, 0),//right
    vec3(   0,   -.75, -.75)//bottom
];

var startTriangles =[
    0,1,2,
    0,2,3,
    0,3,4,
    0,4,1
];

var startVerticesB = [
    vec3(   0, .75, -1.0),//top
    vec3(-.75,-.75, -1.0),//left
    vec3( .75,-.75, -1.0),//right
    vec3(   0,   -.75,-1.5),//bottom
    vec3(   0,   0,  -.5)
];

var startTrianglesB =[
    0,1,2,
    0,2,3,
    0,3,4,
    0,4,1
];

var ITERATIONS = 12;

function startMountain(textArea)
{
    ITERATIONS =  Number(textArea.value);
    vertices = startVertices;
    triangles = startTriangles;


    for(var i =0; i < ITERATIONS; ++i)
    {
        triangles = getTriangles();
    }
}

function getTriangles()
{
    var temp = [];
    for(var i = 0; i < triangles.length; i+=3)
    {
        temp = temp.concat(getNextTriangle(i));
    }
    return flatten(temp);
}

function getNextTriangle(i)
{
    var bisectIndices = [];
    bisectIndices[0] = getBisectIndex(triangles[i], triangles[i+1]);
    bisectIndices[1] = getBisectIndex(triangles[i+1],triangles[i+2]);
    bisectIndices[2] = getBisectIndex(triangles[i+2],triangles[i]);
    var newTriangles = [
        vec3(triangles[i],bisectIndices[0],bisectIndices[2]), //top triangle
        vec3(bisectIndices[0],triangles[i+1],bisectIndices[1]), //bottom left
        vec3(bisectIndices[2],bisectIndices[1],triangles[i+2]), //bottom right
        vec3(bisectIndices[0],bisectIndices[1],bisectIndices[2])//middle
    ];
    return newTriangles;
}

function getBisectIndex(i,j)
{
    if(bisections[i] != undefined && bisections[i][j] != undefined)
    {
        return bisections[i][j];
    }
    else if(bisections[j] != undefined &&bisections[j][i] != undefined)
    {
        return bisections[j][i];
    }
    else
    {
        if(bisections[i] == undefined) {
            bisections[i] = [];
        }
        if(bisections[j] == undefined) {
            bisections[j] = [];
        }
        vertices.push(bisect(vertices[i],vertices[j]));
        bisections[i][j] = bisections[j][i] = vertices.length - 1;
        return bisections[i][j];
    }
}

function bisect(i,j)
{
    var temp = [(i[0]+j[0])/2,(i[1]+j[1])/2,(i[2]+j[2])/2];
    var length = getDist(i,j);
    length = length * .1;
    for(var k = 0; k < 3; ++k)
    {
        temp[k] += (Math.random() - .5) * length;
    }
    return temp;
}

function getDist(i,j)
{
    return Math.sqrt(Math.pow(j[0]-i[0],2)+Math.pow(j[1]-i[1],2)+Math.pow(j[2]-i[2],2));
}
/// APPLICATION ENTRY POINT ///
window.onload = function init()
{
    // Retrieve HTML elements
    var canvas = document.getElementById( "gl-canvas" );
    var textArea = document.getElementById("SMIterations");

    // Initialize gl
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );}

    // Set click function to change number of iterations
    document.getElementById("SMRefresh").onclick = function(){
        startMountain(textArea); gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW );
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(triangles)), gl.STATIC_DRAW); rerender();};


    startMountain(textArea);
    // Execute sierpinskiMountain
    //triangles = getTriangles();

    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);

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
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW );
    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(triangles)), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    rotationLoc = gl.getUniformLocation(program, "rotation");
    console.log(triangles.length/3);
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
    theta += 2.0;

    var angle = radians( theta );
    var c = Math.cos( angle );
    var s = Math.sin( angle );


    gl.uniform2fv(rotationLoc, vec2(c,s));

    gl.drawElements(gl.TRIANGLES, triangles.length ,gl.UNSIGNED_SHORT,0);

    requestAnimFrame(render);
}

function rerender()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
    // theta += 2.0;

    var angle = radians( theta );
    var c = Math.cos( angle );
    var s = Math.sin( angle );


    gl.uniform2fv(rotationLoc, vec2(c,s));

    gl.drawElements(gl.TRIANGLES, triangles.length ,gl.UNSIGNED_SHORT,0);
}