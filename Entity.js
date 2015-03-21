// Trisis

// Common methods and attributes for all shapes.

// Add this.image when using.
function Entity(descr) {
	for (var property in descr)
		this[property] = descr[property];

		this.points = [];
		this.texCoords = [];
}

Entity.prototype.loadToGPU = function() {
	//points
	this.vBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

	// textures
	this.tBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);
};

Entity.prototype.useTexture = function() {
	util.configureTexture(this.image);
};

Entity.prototype.useBuffers = function() {
    // points
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    // textures
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tBufferId);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);

};

Entity.prototype.drawArrays = function(ctm, i, n) {
	gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLES, i, n);
};

Entity.prototype.render = function(mv) {
	// Make this scaling more general
	// mv = mult(mv, util.scale4(0.5, 0.5, 0.5));

	this.useTexture();
    this.useBuffers();
    this.drawArrays(mv, 0, this.numVertices);
    gl.bindTexture(gl.TEXTURE_2D, null);
};
