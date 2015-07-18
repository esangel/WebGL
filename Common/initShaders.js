//
//  initShaders.js
//

function initShaders( gl, vertexShaderId, fragmentShaderId )
{
    var vertShdr;
    var fragShdr;
    var msg;

    var vertElem = document.getElementById( vertexShaderId );
    if ( !vertElem ) { 
        alert( "Unable to load vertex shader " + vertexShaderId );
        return -1;
    }

    vertShdr = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertShdr, vertElem.text );
    gl.compileShader( vertShdr );
    if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
        msg = "Vertex shader failed to compile.  The error log is:"
            + "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
        alert( msg );
        return -1;
    }

    var fragElem = document.getElementById( fragmentShaderId );
    if ( !fragElem ) { 
        alert( "Unable to load vertex shader " + fragmentShaderId );
        return -1;
    }

    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragShdr, fragElem.text );
    gl.compileShader( fragShdr );
    if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
        msg = "Fragment shader failed to compile.  The error log is:"
            + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
        alert( msg );
        return -1;
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}
