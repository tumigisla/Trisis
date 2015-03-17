/////////////////////////////////////////////////////////////////
// Hexahedron (cube)
//
// Vertices: 8
// Edges: 12
// Faces: 6
// Edges per face: 4
// Edges per vertex: 3
// Sin of angle at edge: 1
// Surface area: 6 * edgelength^2
// Volume: edgelength^3
// Inscribed radius: 1 / 2 * edgelength
// Circumscribed radius: sqrt(3) / 2 * edgelength
/////////////////////////////////////////////////////////////////

function Cube(descr) {
    for(var property in descr)
        this[property] = this[property];

    this.numVertices = 36; // Faces * Vertices per face(6 here -> 2 triangle per face)
}

Cube.prototype = new Entity();

Cube.prototype.quad = function(a, b, c, d) {

    var vert = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var texCo = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    var indices = [ a, b, c, a, c, d ];
    var texind  = [ 1, 0, 3, 1, 3, 2 ];

    for ( var i = 0; i < indices.length; ++i ) {
        this.points.push( vert[indices[i]] );
        this.texCoords.push( texCo[texind[i]] );
    }
};

Cube.prototype.build = function() {
    this.quad(1, 0, 3, 2);
    this.quad(2, 3, 7, 6);
    this.quad(3, 0, 4, 7);
    this.quad(6, 5, 1, 2);
    this.quad(4, 5, 6, 7);
    this.quad(5, 4, 0, 1);
};
