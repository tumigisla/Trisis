var util = {

	resize : function(vertices, factor) {
	    for (var i = 0; i< vertices.length; i++)
	        for (var j = 0; j < vertices[i].length; j++)
	            vertices[i][j] *= factor;
	    return vertices;
	},

	scale4 : function(x, y, z) {
	    if ( Array.isArray(x) && x.length == 3 ) {
	        z = x[2];
	        y = x[1];
	        x = x[0];
	    }

	    var result = mat4();
	    result[0][0] = x;
	    result[1][1] = y;
	    result[2][2] = z;

	    return result;
	},

	abs : function(x) {
		return x < 0 ? -x : x;
	},

	configureTexture : function(image) {
		texture = gl.createTexture();
	    gl.bindTexture( gl.TEXTURE_2D, texture );
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
	    gl.generateMipmap( gl.TEXTURE_2D );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	    
	    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	},

	// True or False
	coinFlip : function() {
		return Math.random() > 0.5;
	}

};
