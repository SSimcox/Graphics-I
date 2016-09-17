attribute vec4 vPosition;

uniform vec2 rotation;

void
main()
{
     mat4 toOrigin = mat4(1.0,0,0,0,
     0,1.0,0,0,
     0,0,1.0,1.0,
     0,0,0,1.0
     );
     mat4 back = mat4(1.0,0,0,0,
          0,1.0,0,0,
          0,0,1.0,-1.0,
          0,0,0,1.0
          );
     mat4 ry = mat4( rotation.x, 0.0, -rotation.y, 0.0,
    		    0.0, 1.0,  0.0, 0.0,
    		    rotation.y, 0.0,  rotation.x, 0.0,
    		    0.0, 0.0,  0.0, 1.0 );

	gl_PointSize = 1.0;
//    gl_Position = toOrigin * ry * back *  vPosition;
    gl_Position = ry * vPosition;
}