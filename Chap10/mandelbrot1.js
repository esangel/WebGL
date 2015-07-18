"use strict";

//
// Display a Mandelbrot set
//

var canvas;
var gl;
var render;

window.onload = init;

/* default data*/

/* N x M array to be generated */

var height = 0.5;          /* size of window in complex plane */
var width = 0.5;
var cx = -0.5;             /* center of window in complex plane */
var cy = 0.5;
var max = 100;             /* number of interations per point */

var n = 512;
var m =512;

var texImage = new Uint8Array(4*n*m);

    for ( var i = 0; i < n; i++ )
        for ( var j = 0; j < m; j++ ) {

            var x = i * ( width / (n - 1) ) + cx - width / 2;
            var y = j * ( height / ( m - 1 ) ) + cy - height / 2;

	    var c = [ 0.0, 0.0 ];
	    var p =  [ x, y ];

            for ( var k = 0; k < max; k++ ) {

		// compute c = c^2 + p

            c = [c[0]*c[0]-c[1]*c[1], 2*c[0]*c[1]];
            c = [c[0]+p[0],  c[1]+p[1]];
            var v = Math.sqrt(c[0]*c[0]+c[1]*c[1]);

            if ( v > 4.0 ) break;      /* assume not in set if mag > 4 */
        }

        // assign gray level to point based on its magnitude */

        if ( v > 1.0 ) v = 1.0;        /* clamp if > 1 */

        texImage[4*i*m+4*j] = 255*v;
        texImage[4*i*m+4*j+1] =255*( 0.5* (Math.sin( v*Math.PI/180 ) + 1.0));
        texImage[4*i*m+4*j+2] = 255*(1.0 - v);
        texImage[4*i*m+4*j+3] = 255;

     }

//----------------------------------------------------------------------------

function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
;

    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D( gl.TEXTURE_2D, 0,gl.RGBA, n, m, 0, gl.RGBA, gl.UNSIGNED_BYTE, texImage );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    // Create and initialize a buffer object

    var points = [

    vec4(0.0, 0.0, 0.0, 1.0),
	vec4(0.0, 1.0, 0.0, 1.0),
	vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
	vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0)
];

var texCoord = [

    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 1),
    vec2(1, 0),
    vec2(0, 0),
];

    // Load shaders and use the resulting shader program

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up vertex arrays
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0,0);
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );


    var tbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tbuffer );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.enableVertexAttribArray( vTexCoord );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0,0 );
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(texCoord), gl.STATIC_DRAW );

    // Set our texture samples to the active texture unit
    gl.uniform1i( gl.getUniformLocation(program, "texture"), 0 );


    gl.bufferData( gl.ARRAY_BUFFER,  flatten(texCoord), gl.STATIC_DRAW );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
}

//----------------------------------------------------------------------------


    render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
