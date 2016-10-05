/**
 * Created by Steven on 9/9/2016.
 */

var dimension;
var s = 0.1;
var scaleMatrix = mat3(s,0,0,0,s,0,0,0,s);
var currentCellValue = 0;
// First Person
var lookAtDegree;
var otherLAD;
var loc;
var dest;
var up;
// Bird's eye
var otherLoc;
var otherDest;
var otherUp;
var otherPers;
var pers;
var beginToggled = false;
var fp = !beginToggled;
var keys = [false,false,false,false];

function toggleView(){
    var tempLoc = otherLoc;
    var tempDest = otherDest;
    var tempUp = otherUp;
    var tempPers = otherPers;
    var tempLAD = otherLAD;

    otherLoc = loc;
    otherDest = dest;
    otherUp = up;
    otherPers = pers;
    otherLAD = lookAtDegree;

    loc = tempLoc;
    dest = tempDest;
    up = tempUp;
    pers = tempPers;
    lookAtDegree = tempLAD;

    fp = !fp;
}

function resetVars(textArea){
    dimension = Number(textArea.value);

    lookAtDegree = -90;
    loc = vec3(.5,.5,-0.1);
    dest = add(loc, vec3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))));
    up = vec3(0,1,0);
    pers = perspective(120,1,0.01, dimension);

// Bird's eye
    otherLAD = -90;
    otherLoc = vec3(dimension / 2,dimension / 1.25, dimension / 2);
    otherDest = vec3(dimension / 2,.5, -dimension / 2);
    otherUp = vec3(0,1,-1);
    otherPers = perspective(60,1,0.01, dimension*2);
    document.getElementById("target-cell").innerHTML = "Target Cell: " + (dimension**2-1).toString();
    if(!fp) {
        beginToggled = true;
        fp = ! fp;
    }
    else{
        beginToggled = false;
    }
}

function runMaze(textArea){
    resetVars(textArea);

    genPaths();
    generateVertices();
    createWalls();
    setGLVars();

    if(beginToggled)
        toggleView();
}


function press(event) {
    if (event.keyCode === 37) {
        keys[0] = true;
        event.preventDefault();
    }
    else if(event.keyCode === 38){
        keys[1] = true;
        event.preventDefault();
    }
    else if(event.keyCode === 39){
        keys[2] = true;
        event.preventDefault();
    }
    else if(event.keyCode === 40) {
        keys[3] = true;
        event.preventDefault();
    }
}

function unPress(event) {
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

function turn(dir, val) {
    if(fp)
        dest = add(loc, vec3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))));
    else{
        var i = dir === "side" ? val : 0;
        var j = dir === "up" ? val : 0;
        dest = add(dest, vec3(i,0,j));
        loc = add(loc, vec3(i,0,j));
    }
}

function move(val) {
    var tempLoc;
    if(val < 0) {
        tempLoc = subtract(loc, mult(scaleMatrix,mat3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))))[0]);
    }
    else {
        tempLoc = add(loc, mult(scaleMatrix,mat3(Math.cos(radians(lookAtDegree)), 0, Math.sin(radians(lookAtDegree))))[0]);
    }
    if(fp){
        var tempCell = location(tempLoc);
        if(tempCell < 0) {}
        else if(currentCellValue != tempCell){
            switch (tempCell - currentCellValue){
                case 1: loc = paths[currentCellValue][0] === "open" ? tempLoc : loc;
                    break;
                case -1: loc = paths[tempCell][0] === "open" ? tempLoc : loc;
                    break;
                case dimension: loc = paths[currentCellValue][1] === "open" ? tempLoc : loc;
                    break;
                case -dimension: loc = paths[tempCell][1] === "open" ? tempLoc : loc;
                    break;
            }
        }
        else loc = tempLoc;
    }
    turn("up",-val);
}

function render() {
    if (keys[0]) {
        if(fp) lookAtDegree-=2.5;
        turn("side", -1);
    }
    else if(keys[1])
        move(1);
    else if(keys[2]){
        if(fp)lookAtDegree+=2.5;
        turn("side", 1);
    }
    else if(keys[3])
        move(-1);

    // First person
    var look = lookAt(loc, dest, up);
    // var identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    var transform = mult(pers,look);
    gl.uniformMatrix4fv(viewTransform, false, flatten(transform));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, wallIndex.length ,gl.UNSIGNED_SHORT,0);
    setCell();
    requestAnimFrame(render);
}

//TODO: Location tracker and collision management
function location(pos){
    return dimension * + Math.floor(-pos[2]) + Math.floor(pos[0]);
}

function setCell()
{
    currentCellValue = location(loc);
    currentCell.innerHTML = "Current Cell: " + currentCellValue.toString();
}