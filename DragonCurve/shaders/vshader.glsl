attribute vec4 vPosition;

//out vec3  vertexColor;
void
main()
{
	gl_PointSize = 1.0;
    gl_Position = vPosition;
//    vertexColor = (vPosition.x / 2.0 + 1.0, 1.0 - (vPosition.y / 2.0 + 1.0), vPosition.x / 2.0 + 1.0);
}