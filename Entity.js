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
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // textures
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tBufferId);
    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

};

Entity.prototype.drawArrays = function(ctm, i, n) {
	gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLES, i, n);
};

Entity.prototype.render = function(ctm) {
	this.useTexture();
    this.useBuffers();
    this.drawArrays(ctm, 0, this.numVertices);
};
