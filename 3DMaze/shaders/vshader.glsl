attribute vec4 vPosition;
attribute vec3 myColor;

varying vec3 outColor;
uniform mat4 transform;

void main() {
	gl_PointSize = 1.0;
    gl_Position = transform * vPosition;
    outColor = myColor;
}