precision mediump float;

void
main()
{

//    float blueAmt = ((gl_FragCoord.y + .75) / 1.5 / 512.0) - gl_FragCoord.z;
//    float redAmt = ((gl_FragCoord.y + .75) / 1.5 / (512.0 - (512.0/4.0))) - gl_FragCoord.z;
//    float greenAmt = ((gl_FragCoord.y + .75) / 1.5 /(512.0/2.0)) - gl_FragCoord.z;

    float blueAmt = (gl_FragCoord.y + .75) / 1.5 / 512.0;
    float redAmt = ((gl_FragCoord.y + .75) / 1.5 / (512.0 - (512.0/4.0))) - gl_FragCoord.z;
    float greenAmt = ((gl_FragCoord.y + .75) / 1.5 /(512.0/2.0)) - gl_FragCoord.z;

    gl_FragColor = vec4( redAmt, greenAmt, blueAmt, 1.0 );
}