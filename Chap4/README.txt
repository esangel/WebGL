Chapter 4 programs

cube: displays a rotating cube with vertex colors interpolated across faces

cubev: same as cube but with element arrays

cubeq: same as cube but uses quaternions to do the rotation in the vertex shader

trackball: creates a virtual trackball to control rotation of cube. Increments rotation matrix in application and send it to vertex shader

trackballQuaternion: similar to trackball but uses quaternions. Rotation quaternion is incremented in application and sent to vertex shader