/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Grid(descr) {
    for(var property in descr)
        this[property] = descr[property];

    this.numVertices = 44;

    this.image = textureImgs[2];

    this.build();
}

Grid.prototype = new Entity();

Grid.prototype.build = function() {
    this.points = [];
    var x = -1.2, z = -1.2, y = -7.2;
    for (var i = 0; i <= 6; i++) {
        this.points.push( vec3(x, y, z) );
        this.points.push( vec3(x + 2.4, y, z) );

        z += 0.4;
    }
    z = -1.2;

    for (var i = 0; i <= 6; i++) {
        this.points.push( vec3(x, y, z) );
        this.points.push( vec3(x, y, z + 2.4) );

        x += 0.4;
    }
    x = -1.2;

    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, y + 7.8, z) );

    x += 2.4;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, y + 7.8, z) );

    z += 2.4;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, y + 7.8, z) );

    x -= 2.4;
    this.points.push( vec3(x, y, z) );
    this.points.push( vec3(x, y + 7.8, z) );

    
    var a = vec3(-1.2, 0.6, -1.2),
        b = vec3(-1.2, 0.6,  1.2),
        c = vec3( 1.2, 0.6, -1.2),
        d = vec3( 1.2, 0.6,  1.2);

    this.points.push( a );
    this.points.push( b );

    this.points.push( b );
    this.points.push( d );

    this.points.push( d );
    this.points.push( c );

    this.points.push( c );
    this.points.push( a );

    for (var i = 0; i < this.points.length; i++)
        this.texCoords.push( vec2(0, 0) );
};

Grid.prototype.drawArrays = function(ctm, i, n) {
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.LINES, i, n);
};
