"use strict";

var canvas;
var gl;

var pointsArray = [];

var near = -4;
var far = 4;

var theta  = 0.0;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var fColor;

var eye, at, up;
var light;

var m;

var red;
var black;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    light = vec3(0.0, 2.0, 0.0);

// matrix for shadow projection

    m = mat4();
    m[3][3] = 0;
    m[3][1] = -1/light[1];


    at = vec3(0.0, 0.0, 0.0);
    up = vec3(0.0, 1.0, 0.0);
    eye = vec3(1.0, 1.0, 1.0);

    // color square red and shadow black

    red = vec4(1.0, 0.0, 0.0, 1.0);
    black = vec4(0.0, 0.0, 0.0, 1.0);

    // square

    pointsArray.push(vec4( -0.5, 0.5,  -0.5, 1.0 ));
    pointsArray.push(vec4( -0.5,  0.5,  0.5, 1.0 ));
    pointsArray.push(vec4( 0.5, 0.5,  0.5, 1.0 ));
    pointsArray.push(vec4( 0.5,  0.5,  -0.5, 1.0 ));

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    render();

}


var render = function() {

        theta += 0.1;
        if(theta > 2*Math.PI) theta -= 2*Math.PI;

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // model-view matrix for square

        modelViewMatrix = lookAt(eye, at, up);

        // send color and matrix for square then render

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(red));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        // rotate light source

        light[0] = Math.sin(theta);
        light[2] = Math.cos(theta);

        // model-view matrix for shadow then render

        modelViewMatrix = mult(modelViewMatrix, translate(light[0], light[1], light[2]));
        modelViewMatrix = mult(modelViewMatrix, m);
        modelViewMatrix = mult(modelViewMatrix, translate(-light[0], -light[1],
           -light[2]));

        // send color and matrix for shadow

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        requestAnimFrame(render);
    }
