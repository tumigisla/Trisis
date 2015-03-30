/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Grid(descr) {
    for(var property in descr)
        this[property] = descr[property];

    this.numVertices = 12;

    this.image = textureImgs[4];

    this.height = 8;
    this.width = 2.4;

    this.gridSize = 0.4;
    
    this.points = [
        // side
        vec3(-1.4, -7.4, 1.0),
        vec3( 1.0, -7.4, 1.0),
        vec3( 1.0,  0.6, 1.0),
        vec3( 1.0,  0.6, 1.0),
        vec3(-1.4,  0.6, 1.0),
        vec3(-1.4, -7.4, 1.0),
        
        // bottom
        vec3(-1.4, -7.4, -1.4),
        vec3( 1.0, -7.4, -1.4),
        vec3( 1.0, -7.4,  1.0),
        vec3( 1.0, -7.4,  1.0),
        vec3(-1.4, -7.4,  1.0),
        vec3(-1.4, -7.4, -1.4)
    ];

    this.texCoords = [
        // side
        vec2( 0.0, 0.0 ),
        vec2( 6.0, 0.0 ),
        vec2( 6.0, 20.0 ),
        vec2( 6.0, 20.0 ),
        vec2( 0.0, 20.0 ),
        vec2( 0.0, 0.0 ),

        // bottom
        vec2( 0.0, 0.0 ),
        vec2( 6.0, 0.0 ),
        vec2( 6.0, 6.0 ),
        vec2( 6.0, 6.0 ),
        vec2( 0.0, 6.0 ),
        vec2( 0.0, 0.0 )
    ];
}

Grid.prototype = new Entity();

Grid.prototype.render = function (mv) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.cullFace(gl.FRONT);

    // render sides
    this.useTexture();
    this.useBuffers();
    this.drawArrays(mv, 0, 6);

    var mv0 = [];
    mv0.push(mv);
        mv = mult( mv, translate([0,0,-0.4]));
        mv = mult( mv, rotate(90, [0,1,0]));
        this.drawArrays(mv, 0, 6);
    mv = mv0.pop();
    mv0.push(mv);
        mv = mult( mv, translate([-0.4,0,-0.4]));
        mv = mult( mv, rotate(180, [0,1,0]));
        this.drawArrays(mv, 0, 6);
    mv = mv0.pop();
    mv0.push(mv);
        mv = mult( mv, translate([-0.4,0,0]));
        mv = mult( mv, rotate(270, [0,1,0]));
        this.drawArrays(mv, 0, 6);
    mv = mv0.pop();

    gl.disable(gl.CULL_FACE);

    // render bottom
    this.drawArrays(mv, 6, 6);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.disable(gl.BLEND);
}