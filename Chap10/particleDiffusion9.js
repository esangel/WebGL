"use strict";

var t1, t2;
t1 = new Date();

var canvas;
var gl;

var flag = true;

var texSize = 1024;
var numPoints = 1000;
var diffuse = 4.0;
var pointSize = 5.0;

var released = 1;
var time = 0;
var dt = 0.01;

var newPoint = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 0),
    vec2(1, 1)
];

var vertices = [
    vec2(-1.0, -1.0),
    vec2(-1.0, 1.0 ),
    vec2(1.0, -1.0) ,
    vec2(1.0, 1.0)
];

var program1, program2;
var framebuffer;
var texture1, texture2;

var buffer;
var vPosition1, vPosition2;
var vTexCoord;
var texLoc;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport(0, 0, texSize, texSize);
    gl.activeTexture( gl.TEXTURE0 );

    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    gl.bindTexture(gl.TEXTURE_2D, texture2);

    //
    //  Load shaders and initialize attribute buffers
    //

    program1 = initShaders( gl, "vertex-shader1", "fragment-shader1" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );

    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = texSize;
    framebuffer.height = texSize;

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) alert('Framebuffer Not Complete');


    for(var i = 0; i<numPoints/2; i++) {
         vertices[4+i] = vec2(0.5, 0.5);
         vertices[4+i+numPoints/2] = vec2(-0.5, -0.5);
		 }

    buffer = gl.createBuffer();

    gl.useProgram(program2);

    gl.uniform1f( gl.getUniformLocation(program2, "pointSize"), pointSize );
    gl.uniform4f( gl.getUniformLocation(program2, "color"), 0.0, 0.0, 0.9, 1.0);

    gl.useProgram(program1);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 64+8*numPoints, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.bufferSubData(gl.ARRAY_BUFFER, 32+8*numPoints, flatten(texCoord));

    // buffers and vertex arrays


    vPosition1 = gl.getAttribLocation( program1, "vPosition1" );
    gl.enableVertexAttribArray( vPosition1 );
    gl.vertexAttribPointer( vPosition1, 2, gl.FLOAT, false, 0,0 );

    vTexCoord = gl.getAttribLocation( program1, "vTexCoord");
    gl.enableVertexAttribArray( vTexCoord );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 32+8*numPoints );

    gl.uniform1i( gl.getUniformLocation(program1, "texture"), 0 );
    gl.uniform1f( gl.getUniformLocation(program1, "d"), 1/texSize );
    gl.uniform1f( gl.getUniformLocation(program1, "s"), diffuse );

    gl.useProgram(program2);

    vPosition2 = gl.getAttribLocation( program2, "vPosition2" );
    gl.enableVertexAttribArray( vPosition2 );
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0,0 );

    gl.useProgram(program1);

    gl.bindTexture(gl.TEXTURE_2D, texture2);

    render();
}

var render = function(){

   // render to texture

    gl.useProgram(program1);

    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

    if(flag) {
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

    }
    else {
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

    }

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) alert('Framebuffer Not Complete');

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.useProgram(program2);
    gl.enableVertexAttribArray( vPosition2 );
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f( gl.getUniformLocation(program2, "color"), 0.9, 0.0, 0.9, 1.0);
    gl.drawArrays(gl.POINTS, 4, numPoints/2);
    gl.uniform4f( gl.getUniformLocation(program2, "color"), 0.0, 9.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 4+numPoints/2, numPoints/2);

    gl.useProgram(program1);
    gl.enableVertexAttribArray( vTexCoord );
    gl.enableVertexAttribArray( vPosition1 );
    gl.vertexAttribPointer( texLoc, 2, gl.FLOAT, false, 0, 32+8*numPoints);
    gl.vertexAttribPointer( vPosition1, 2, gl.FLOAT, false, 0, 0);


// render to display

    gl.useProgram(program1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if(flag) gl.bindTexture(gl.TEXTURE_2D, texture2);
      else gl.bindTexture(gl.TEXTURE_2D, texture1);

    var r = 1024/texSize;
    gl.viewport(0, 0, r*texSize, r*texSize);

    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.viewport(0, 0, texSize, texSize);


    gl.useProgram(program2);

// move particles in a random direction
// wrap arounds

    gl.useProgram(program2);
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f( gl.getUniformLocation(program2, "color"), 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 4, numPoints);

    gl.useProgram(program1);
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 32+8*numPoints);

    for(var i=0; i<released; i++) {
      newPoint[0] = vertices[4+i][0] + 0.01*(2.0*Math.random()-1.0);
      newPoint[1] = vertices[4+i][1] + 0.01*(2.0*Math.random()-1.0);
      if((newPoint[0]<-0.25)||(newPoint[0]>0.25)||
            (newPoint[1]<-0.25)||(newPoint[1]> 0.25)) {
        vertices[4+i][0] = newPoint[0];
        vertices[4+i][1] = newPoint[1];
      }
      newPoint[0] = vertices[4+i+numPoints/2][0] + 0.01*(2.0*Math.random()-1.0);
      newPoint[1] = vertices[4+i+numPoints/2][1] + 0.01*(2.0*Math.random()-1.0);
      if((newPoint[0]>0.25)||(newPoint[0]<-0.25)||
            (newPoint[1]>0.25)||(newPoint[1]< -0.25)) {
        vertices[4+i+numPoints/2][0] = newPoint[0];
        vertices[4+i+numPoints/2][1] = newPoint[1];
      }
		time += dt;
		if(time> released)
		  if(2*released < numPoints) released++;

    }
    gl.bufferSubData(gl.ARRAY_BUFFER,  0, flatten(vertices));

// swap textures

    flag = !flag;

    t2 = new Date()
    var fps = Math.floor(1000/(t2.valueOf()-t1.valueOf())+0.5);
    t1 = t2;
//    console.log(fps);


     requestAnimFrame(render);
}
