Chapter 7 Programs:

textureCube1: texture map of a gif image onto cube. Note some browsers such as Chrome will not allow the use of an external file as texture image. Program also displays the image on the right.

textureCubev2: texture mapping checkerboard onto cube

textureCubev3: texture map onto cube using two texture images multiplied together in fragment shader

textureCube4: texture map with two texture units. First applies checkerboard, second a sinusoid.

textureSquare: demo of aliasing with different texture parameters.

reflectionMap: reflection map of a colored cube onto another cube rotating inside of it

reflectionMap2: reflection map of a sphere inside a cube.

reflectingCube: similar to relectionMap but lets the user rotate the object instead of appearing to rotate the texture cube.

reflectingSphere: similar to relectionMap2 but lets the user rotate the object instead of appearing to rotate the texture cube.

bumpMap: bump map of a single square with a square "bump" in the middle and a rotating light

bumpMap2: bump map using 256 x 256 version of the honolulu data. One rotation moves the light source and the other rotates the single polygon that is bump mapped,

hatImage: image of the sombero function with colors assigned to the y values and the resulting image as texture mapped to a square

honoluluImage: image display of height data from hawaii using a texture map with edge
enhancement in the fragment shader

render1: Sierpinski gasket rendered to a texture and then display on a square.

render1v2: renders a triangle to a texture and displays it by a second rendering on a smaller square so blue clear color is visible around rendered square

render3: renders Sierpinski gasket and diffuses result over successive renderings

render4: similar to render2 but renders only a single triangle

render5: same as render4 but only renders the triangle on the first rendering

particleDiffusion: buffer ping ponging of 50 particles initially placed randomly and then moving randomly with their previous positions diffused as a texture.

pickCube: rotating cube rendered off screen with solid colors for each face which are used to identify which face the mouse is clicked on. Color of face is logged onto the console.

pickCube2: rotating cube with lighting. When mouse is clicked, the face name (front, back, right, left, top, bottom, background) is logged onto the console. 

pickCube3: changes the material properties so each face has a color but lighting still still causes varying shades across each face. Name of face color is displayed in window instead of on console

pickCube4: similar to pickCube2 but displays name of picked face in window

cubit: rotating translucent cube. Hidden-surface removal can be toggled on and off.