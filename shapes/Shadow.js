function Shadow(descr) {
    for (var property in descr)
        this[property] = descr[property];
}

Shadow.prototype = new Entity();

Shadow.prototype.init = function() {
    this.points = [];
    this.texCoords = [];
    this.numVertices = 0;

    this.image = textureImgs[3];

    this.initVert = [
        [
            vec3(-1.4, -7.4, -1.399),
            vec3(-1.0, -7.4, -1.399),
            vec3(-1.0, -7.0, -1.399),
            vec3(-1.0, -7.0, -1.399),
            vec3(-1.4, -7.0, -1.399),
            vec3(-1.4, -7.4, -1.399)
        ],
        [
            vec3(-1.4, -7.4, 0.999),
            vec3(-1.0, -7.4, 0.999),
            vec3(-1.0, -7.0, 0.999),
            vec3(-1.0, -7.0, 0.999),
            vec3(-1.4, -7.0, 0.999),
            vec3(-1.4, -7.4, 0.999)
        ],
        [
            vec3(-1.399, -7.4, -1.4),
            vec3(-1.399, -7.4, -1.0),
            vec3(-1.399, -7.0, -1.0),
            vec3(-1.399, -7.0, -1.0),
            vec3(-1.399, -7.0, -1.4),
            vec3(-1.399, -7.4, -1.4)
        ],
        [
            vec3(0.999, -7.4, -1.4),
            vec3(0.999, -7.4, -1.0),
            vec3(0.999, -7.0, -1.0),
            vec3(0.999, -7.0, -1.0),
            vec3(0.999, -7.0, -1.4),
            vec3(0.999, -7.4, -1.4)
        ]
    ];

    this.initTexCoords = [
        vec2( 0.0, 0.0 ),
        vec2( 1.0, 0.0 ),
        vec2( 1.0, 1.0 ),
        vec2( 1.0, 1.0 ),
        vec2( 0.0, 1.0 ),
        vec2( 0.0, 0.0 )
    ];
};

// newCoords: array containing 3 trios of indices
Shadow.prototype.update = function(newCoords) {
    this.points = [];
    this.texCoords = [];
    this.numVertices = 0;
    // this.rotations = [];
    // this.translations = [];

    var texCo = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    var texind  = [ 1, 0, 3, 1, 3, 2 ];

    for (var i = 0; i < newCoords.length; i++) {
        for (var j = 0; j < this.initVert[0].length; j++) {
            this.points.push(
                vec3(
                    this.initVert[0][j][0] + 0.4 * newCoords[i][1],
                    this.initVert[0][j][1] + 0.4 * newCoords[i][0],
                    this.initVert[0][j][2]
                )
            );
            this.texCoords.push(
                vec2(
                    this.initTexCoords[j][0],
                    this.initTexCoords[j][1]
                )
            );
        };

        this.numVertices += 6;
    };

    for (var i = 0; i < newCoords.length; i++) {
        for (var j = 0; j < this.initVert[1].length; j++) {
            this.points.push(
                vec3(
                    this.initVert[1][j][0] + 0.4 * newCoords[i][1],
                    this.initVert[1][j][1] + 0.4 * newCoords[i][0],
                    this.initVert[1][j][2]
                )
            );
            this.texCoords.push(
                vec2(
                    this.initTexCoords[j][0],
                    this.initTexCoords[j][1]
                )
            );
        };

        this.numVertices += 6;
    };

    for (var i = 0; i < newCoords.length; i++) {
        for (var j = 0; j < this.initVert[2].length; j++) {
            this.points.push(
                vec3(
                    this.initVert[2][j][0],
                    this.initVert[2][j][1] + 0.4 * newCoords[i][0],
                    this.initVert[2][j][2] + 0.4 * newCoords[i][2]
                )
            );
            this.texCoords.push(
                vec2(
                    this.initTexCoords[j][0],
                    this.initTexCoords[j][1]
                )
            );
        };

        this.numVertices += 6;
    };

    for (var i = 0; i < newCoords.length; i++) {
        for (var j = 0; j < this.initVert[3].length; j++) {
            this.points.push(
                vec3(
                    this.initVert[3][j][0],
                    this.initVert[3][j][1] + 0.4 * newCoords[i][0],
                    this.initVert[3][j][2] + 0.4 * newCoords[i][2]
                )
            );
            this.texCoords.push(
                vec2(
                    this.initTexCoords[j][0],
                    this.initTexCoords[j][1]
                )
            );
        };

        this.numVertices += 6;
    };
};

Shadow.prototype.render = function(mv) {
    this.useTexture();
    this.useBuffers();

    this.drawArrays(mv, 0, this.numVertices / 4);
    this.drawArrays(mv, 3 * this.numVertices / 4, this.numVertices / 4);
    gl.cullFace(gl.FRONT);
    
    this.drawArrays(mv, this.numVertices / 4, this.numVertices / 4);
    this.drawArrays(mv, 2 * this.numVertices / 4, this.numVertices / 4);
    gl.cullFace(gl.BACK);
};

Shadow.prototype.useBuffers = function () {
        // points
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    // textures
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
};