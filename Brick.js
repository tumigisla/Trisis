/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Brick(descr) {
    // descr must include:
    //     image
    //     y, x, z grid index

    for(var property in descr)
        this[property] = descr[property];

    var gs = grid.gridSize;

    this.translations = [
        this.x * gs,
        this.y * gs,
        this.z * gs
    ];
}

Brick.prototype.build = function() {
    var c1 = new Cube(
        {
            image : this.tex,
            vert : [
                vec3(-1.4, -7.4, -1.0),
                vec3(-1.4, -7.0, -1.0),
                vec3(-1.0, -7.0, -1.0),
                vec3(-1.0, -7.4, -1.0),
                vec3(-1.4, -7.4, -1.4),
                vec3(-1.4, -7.0, -1.4),
                vec3(-1.0, -7.0, -1.4),
                vec3(-1.0, -7.4, -1.4)
            ]
        }
    );

    this.cube = c1;
    this.cube.loadToGPU();
};

Brick.prototype.update = function(dt) {

};

Brick.prototype.render = function(mv) {
    mv = mult( mv, translate(this.translations) );

    this.cube.render(mv);
};



/*

    Inniheldur einn Cube
    Getur dottið niður um 1-3 y-hnit í Grid
    Muna samanlögð translation á sínum Cube

*/