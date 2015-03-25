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
    var c1 = new Brick(
        {
            i : i,
            j : j,
            k : k,
            image : textureImgs[2]
        }
    );
    c1.build();

    this.blob[j][i][k] = c1;
};
