"use strict";

var texSize = 256;

var canvas;
var gl;

var program;

var pointsArray = [];
var texCoordsArray = [];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert( "WebGL isn't available");}

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    pointsArray.push(vec2(-1, -1));
    pointsArray.push(vec2(-1, 1));
    pointsArray.push(vec2(1, 1));
    pointsArray.push(vec2(1, -1));

    texCoordsArray.push(vec2(0, 0));
    texCoordsArray.push(vec2(0, 1));
    texCoordsArray.push(vec2(1, 1));
    texCoordsArray.push(vec2(1, 0));

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition );

    var textureId = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureId);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, texSize, texSize, 0,
         gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

}
