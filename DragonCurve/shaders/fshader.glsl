precision mediump float;

//varying vec3 vertexColor;
void
main()
{
    float blueAmt = (gl_FragCoord.y / 512.0);
    float redAmt = (gl_FragCoord.x / 512.0);
    float greenAmt = 1.0 - (gl_FragCoord.y /512.0);
//      float blueAmt = vertexColor.z;
//      float redAmt = vertexColor.x;
//      float greenAmt = vertexColor.y;
    gl_FragColor = vec4( redAmt, greenAmt, blueAmt, 1.0 );
}