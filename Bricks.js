/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Bricks(descr) {
    for(var property in descr)
        this[property] = descr[property];
}

Bricks.prototype.build = function() {
    this.blob = new Array(20);
    for (var i = 0; i < this.blob.length; i++) {
        this.blob[i] = new Array(6);
        for (var j = 0; j < this.blob[i].length; j++) {
            this.blob[i][j] = new Array(6);
        }
    }
};

Bricks.prototype.render = function(mv) {
    for (var i = 0; i < this.blob.length; i++) {
        for (var j = 0; j < this.blob[i].length; j++) {
            for (var k = 0; k < this.blob[i][j].length; k++) {
                if (this.blob[i][j][k]) {
                    this.blob[i][j][k].render(mv);
                }
            }
        }
    }
};

Bricks.prototype.add = function (i,j,k) {
    var bot1 = -7.4 + i * 0.4,
        top1 = bot1 + 0.4,
        left1 = -1.4 + j * 0.4,
        right1 = left1 + 0.4,
        front1 = -1.4 + k * 0.4
        back1 = front1 + 0.4;

    var c1 = new Cube(
        {
            image : textureImgs[2],
            vert : [
                vec3(  left1, bot1,  back1 ),
                vec3(  left1, top1,  back1 ),
                vec3( right1, top1,  back1 ),
                vec3( right1, bot1,  back1 ),
                vec3(  left1, bot1, front1 ),
                vec3(  left1, top1, front1 ),
                vec3( right1, top1, front1 ),
                vec3( right1, bot1, front1 )
            ]
        }
    );
    c1.loadToGPU();

    this.blob[i][j][k] = c1;
};
