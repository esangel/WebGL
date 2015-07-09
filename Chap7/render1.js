"use strict";

// Note that because this example is 2D, the renderbuffer is not needed
// I have commented out the relevent lines of code
// If you are doing a 3D ap and need a depth buffer then uncomment these lines

var canvas;
var gl;

var numTimesToSubdivide = 5;
var numTriangles = 243;  // 3^5 triangles generated
var numVertices  = 3 * numTriangles;

var Index = 0;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 1),
    vec2(1, 0),
    vec2(0, 0)
];

var vertices = [
    vec2( -1, -1 ),
    vec2(  -1,  1 ),
    vec2(  1, 1 ),
    vec2( 1, 1 ),
    vec2(  1,  -1 ),
    vec2(  -1, -1 )
];

var pointsArray = [];

var program1, program2;
var framebuffer, texture1;
var buffer1, buffer2, buffer3;

//var renderbuffer;

function triangle( a, b, c ) {
    pointsArray.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{
    if ( count == 0 ) {
        triangle( a, b, c );
    }
    else {
        var ab = mix(  a, b, 0.5 );
        var ac = mix(  a, c, 0.5 );
        var bc = mix(  b, c, 0.5 );

        --count;

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


// Create an empty texture

    texture1 = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST )

// Allocate a frame buffer object

   framebuffer = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
   framebuffer.width = 512;
   framebuffer.height = 512;

   //renderbuffer = gl.createRenderbuffer();
   //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
   //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);

// Attach color buffer

   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
   //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

// check for completeness

   var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
   if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');

    //
    //  Load shaders and initialize attribute buffers
    //
    program1 = initShaders( gl, "vertex-shader1", "fragment-shader1" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );

    gl.useProgram( program1 );

    var vertices2 = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    divideTriangle(vertices2[0], vertices2[1], vertices2[2], numTimesToSubdivide);

//______________________________________________

    // Create and initialize a buffer object

    buffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program1, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Bind FBO and render

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);


    gl.viewport(0, 0, 512, 512);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT );

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);

    // Bind to window system frame buffer, unbind the texture

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    //gl.deleteFramebuffer(framebuffer);
    //gl.deleteRenderbuffer(renderbuffer);

    //gl.disableVertexAttribArray(vPos);

    gl.useProgram(program2);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture1);

    // send data to GPU for normal render

    buffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER,   flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program2, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    buffer3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer3);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation( program2, "vTexCoord");
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    gl.uniform1i( gl.getUniformLocation(program2, "texture"), 0);

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.viewport(0, 0, 512, 512);

    render();

}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLES, 0, 6);

}
