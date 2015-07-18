"use strict";

var canvas;
var gl;

var numVertices  = 6;

var texSize = 256;
var numChecks = 64;

//var flag = true;

var near = 0.3;
var far = 3.0;


var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio



var texture1, texture2, texture3, texture4;

// Create a checkerboard pattern using floats


var image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        var c;
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c;
            image1[4*i*texSize+4*j+2] = c;
            image1[4*i*texSize+4*j+3] = 255;
        }
    }


var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var zmin = 1.0;
var zmax = 50.0;

var vertices = [
    vec4( -5.5, 0.0,  zmax, 1.0 ),
    vec4( -5.5,  0.0,  zmin, 1.0 ),
    vec4( 5.5, 0.0,  zmin, 1.0 ),
    vec4( 5.5,  0.0,  zmax, 1.0 ),
];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye = vec3(0.0, 10.0, 0.0);
var at = vec3(0.0, 0.0, (zmax+zmin)/4);
const up = vec3(0.0, 1.0, 0.0);

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta

    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];
window.onload = init;



function configureTexture(image) {
    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
           gl.NEAREST);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};

function quad(a, b, c, d) {

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}


function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    quad( 1, 0, 3, 2 );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture(image1);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

// sliders for viewing parameters

    document.getElementById("zFarSlider").onchange = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").onchange = function(event) {
        near = event.target.value;
    };
    document.getElementById("aspectSlider").onchange = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
    };

        document.getElementById("Texture Style").onclick = function( event) {
          switch(event.target.index) {
            case 0:
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                   gl.NEAREST_MIPMAP_NEAREST);
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                    gl.NEAREST );
               break;
            case 1:
               gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                    gl.NEAREST_MIPMAP_LINEAR);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR );
               break;
           case 2:
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR_MIPMAP_NEAREST );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                    gl.NEAREST );
               break;
            case 3:
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR_MIPMAP_LINEAR );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR );
               break;
        };
    };

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT);


    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
