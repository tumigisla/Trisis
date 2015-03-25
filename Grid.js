/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Grid(descr) {
    for(var property in descr)
        this[property] = descr[property];

    this.numVertices = 120;

    this.image = textureImgs[3];

    this.height = 8;
    this.width = 2.4;

    this.hOffset = -0.2;
    this.vOffset = 0.6;
    this.gridSize = 0.4;
    
    this.vMin = -this.height + this.vOffset; // -7.4
    this.hMin = -this.width / 2 + this.hOffset; // -1.4

    this.vMax = this.vOffset; // 0.6
    this.hMax = this.width / 2 + this.hOffset; // 1.0

    this.drawSidesDec = gridLookatDec.ver0;
    /*
    this.drawNegX = true;
    this.drawPosX = false;
    this.drawNegZ = true;
    this.drawPosZ = false;
    */
}

Grid.prototype = new Entity();

Grid.prototype.build = function() {
    this.points = [];

    // floor of grid
    var x = this.hMin, z = this.hMin, y = this.vMin;
    for (var i = 0; i <= 6; i++) {
        this.points.push( vec3(x, y, z) );
        this.points.push( vec3(x + this.width, y, z) );

        z += this.gridSize;
    }
    z = this.hMin;

    for (var i = 0; i <= 6; i++) {
        this.points.push( vec3(x, y, z) );
        this.points.push( vec3(x, y, z + this.width) );

        x += this.gridSize;
    }

    // vertical lines
    x = this.hMin;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, this.vMax, z) );

    x += this.width;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, this.vMax, z) );

    z += this.width;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, this.vMax, z) );

    x -= this.width;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, this.vMax, z) );

    // horizontal lines
    y = this.vMin;
    for (var i = 0; i < 20; i++) {
        y += 0.4;
        var a = vec3(this.hMin, y, this.hMin),
            b = vec3(this.hMin, y, this.hMax),
            c = vec3(this.hMax, y, this.hMin),
            d = vec3(this.hMax, y, this.hMax);

        if (i == 19 || this.drawSidesDec[0]) {
            this.points.push( a );
            this.points.push( b );
        }
        
        if (i == 19 || this.drawSidesDec[1]) {
            this.points.push( d );
            this.points.push( c );
        }
        
        if (i == 19 || this.drawSidesDec[2]) {
            this.points.push( c );
            this.points.push( a );
        }
        
        if (i == 19 || this.drawSidesDec[3]) {
            this.points.push( b );
            this.points.push( d );
        }
    }

    for (var i = 0; i < this.points.length; i++)
        this.texCoords.push( vec2(0, 0) );

    this.loadToGPU();
};

Grid.prototype.drawArrays = function(ctm, i, n) {
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.LINES, 0, this.points.length);
};