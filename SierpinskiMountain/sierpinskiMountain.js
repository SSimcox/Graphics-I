/**
 * Created by Steven on 9/12/2016.
 */

var gl;
var vertices = [];
var bisections = [];
var triangles = [];

var startVertices = [
    vec3(0,1,0),//top
    vec3(-1,0,0),//left
    vec3(1,0,0),//right
    vec3(0,0,-1)//bottom
];

var startTriangles =[
    vec3(0,1,2),
    vec3(0,2,3),
    vec3(0,3,1)
];

var ITERATIONS = 12;

function startMountain(textArea)
{
    ITERATIONS =  Number(textArea.value);
    triangles = [];


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
    return temp;
}

function getNextTriangle(i)
{
    var bisectIndices=[];
    bisectIndices.push(getBisectIndex(i,i+1));
    bisectIndices.push(getBisectIndex(i+1,i+2));
    bisectIndices.push(getBisectIndex(i+2,i));
    var newTriangles = [
        vec3(i,bisectIndices[0],bisectIndices[2]), //top triangle
        vec3(bisectIndices[0],i+1,bisectIndices[1]), //bottom left
        vec3(bisectIndices[2],bisectIndices[1],i+2), //bottom right
        vec3(bisectIndices[0],bisectIndices[1],bisectIndices[2])//middle
    ];
    return newTriangles;
}

function getBisectIndex(i,j)
{
    if(bisections[(i, j)] != undefined)
    {
        return bisections[(i,j)];
    }
    else if(bisections[(j, i)] != undefined)
    {
        return bisections[(j, i)];
    }
    else
    {
        vertices.push(bisect(i,j));
        bisections[(i,j)] = bisections[(j,i)] = vertices.length - 1;
    }
}

function bisect(i,j)
{
    var temp = vec3((i[0]+j[0])/2,(i[1]+j[1])/2,(i[2]+j[2])/2);
    var length = getDist(i,j);
    length = length * .1;
    for(var k = 0; k < 3; ++k)
    {
        temp[k] += (Math.random() - .5);
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
    // var directionArea = document.getElementById("DCDirection");

    // Initialize gl
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );}
    // Initialize bufferId for vertices
    var bufferId = gl.createBuffer();

    // Set click function to change number of iterations
    document.getElementById("SMRefresh").onclick = function(){
        triangles = getTriangles(); render();};

    // Execute sierpinskiMountain
    //triangles = getTriangles();



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