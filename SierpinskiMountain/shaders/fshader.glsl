precision mediump float;


void
main()
{
    float blueAmt = (gl_FragCoord.y / 512.0);
    float redAmt = (gl_FragCoord.x / 1024.0);
    float greenAmt = 1.0 - (gl_FragCoord.y /1024.0);
    gl_FragColor = vec4( redAmt, greenAmt, blueAmt, 1.0 );
}