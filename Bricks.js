/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Bricks(descr) {
    for(var property in descr)
        this[property] = descr[property];

    this.height = 8;
    this.width = 2.4;

    this.hOffset = -0.2;
    this.vOffset = 0.6;
    this.gridSize = 0.4;
    
    this.vMin = -this.height + this.vOffset; // -7.4
    this.hMin = -this.width / 2 + this.hOffset; // -1.4
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
    var bot1 = this.vMin + i * this.gridSize,
        top1 = bot1 + this.gridSize,
        left1 = this.hMin + j * this.gridSize,
        right1 = left1 + this.gridSize,
        front1 = this.hMin + k * this.gridSize
        back1 = front1 + this.gridSize;

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
