/**
 * Created by Steven on 9/30/2016.
 */
var vertices = [];
var wallIndex = [];
function generateVertices() {
    vertices = [];
    for(var i = 0; i < dimension + 1; i++)
    {
        var g = Math.random();
        var b = Math.random();
        for(let j = 0; j < dimension + 1; j++)
        {
            vertices.push(vec3(j,0,-i));
            vertices.push(vec3(0.0,g,b));
            vertices.push(vec3(j,1,-i));
            vertices.push(vec3(0.0,g,b))
        }
    }
    vertices[(dimension + 1)**2 * 4 - 1] = vec3(1.0, 0.0, 0.0);
    vertices[(dimension + 1)**2 * 4 - 3] = vec3(1.0, 0.0, 0.0);

    vertices[(dimension + 1)**2 * 4 - 1 - ((dimension + 1) * 4)] = vec3(1.0, 0.0, 0.0);
    vertices[(dimension + 1)**2 * 4 - 3 - ((dimension + 1) * 4)] = vec3(1.0, 0.0, 0.0);
}

function createWalls() {
    wallIndex = [];
    for(let i = 0; i < dimension; i++)
    {
        for(let j = 0; j < dimension; j++)
        {
            var me = i * (dimension+1) * 2 + j * 2;
            var augDimension = (dimension+1)*2;
            var position = i * dimension + j;

            // Build North Wall
            if(i == 0 || paths[position - dimension][1] == "closed")
                wallIndex.push(me, me+2, me+1, me+2, me+3, me+1);

            // Build East Wall
            if(j == dimension - 1 || paths[position][0] == "closed")
                wallIndex.push(me+2, me + augDimension + 2, me+3, me + augDimension + 2, me + augDimension + 3, me + 3);

            // Build South Wall
            if(i == dimension - 1 || paths[position][1] == "closed")
                wallIndex.push(me+augDimension+2, me + augDimension, me + augDimension + 3, me + augDimension, me + augDimension + 1, me + augDimension + 3);

            // Build West Wall
            if(j == 0 || paths[position-1][0] == "closed")
                wallIndex.push(me + augDimension, me, me + augDimension + 1, me, me + 1, me + augDimension + 1)
        }
    }
    // Add Floor
    wallIndex.push(0, dimension*(dimension + 1) * 2, dimension * 2);
    wallIndex.push(dimension * (dimension + 1) * 2, dimension * (dimension + 1) * 2 + dimension *2, dimension * 2);

    // Avoid color vecs
    for(let i = 0; i < wallIndex.length; i++)
    {
        wallIndex[i] = wallIndex[i] * 2;
    }
}