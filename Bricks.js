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

Bricks.prototype.add = function (i,j,k,tex) {
    var c1 = new Brick(
        {
            i : i,
            j : j,
            k : k,
            image : tex
        }
    );
    c1.build();

    this.blob[j][i][k] = c1;
};

Bricks.prototype.check = function (i,j,k) {
    var allNums = typeof i === "Number" && typeof j === "Number"
         && typeof k === "Number",
        allArr = typeof i === "Array" && typeof j === "Array"
         && typeof k === "Array";

    if (allNums) {
        if (this.blob[j] && this.blob[j][i] && this.blob[j][i][k])
            return true;
        else 
            return false;
    } else if (allArr) {
        return this.check(i[0], i[1], i[2]) && this.check(j[0], j[1], j[2])
                 && this.check(k[0], k[1], k[2]);
    }
    // else return undefined
};
