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

// input can be 3 indices or 3 arrays each with 3 indices
Bricks.prototype.add = function (y,x,z,tex) {
    if ( typeof y === "number" ) {
        var c1 = new Brick(
            {
                y : y,
                x : x,
                z : z,
                tex : tex
            }
        );
        c1.build();

        this.blob[y][x][z] = c1;
    } else {
        // assume three arrays each with 3 indices
        this.add(y[0], y[1], y[2], tex);
        this.add(x[0], x[1], x[2], tex);
        this.add(z[0], z[1], z[2], tex);
    }
};

// input can be 3 indices or 3 arrays each with 3 indices
Bricks.prototype.check = function (y,x,z) {
    if (keys[89]) {
        console.log( "--------------------------" );
        console.log( "checking:", y, x, z);

        if ( typeof y === "number" ) {
            console.log( "case 1" );

            // num, num, num
            if (this.blob[y] && this.blob[y][x] && this.blob[y][x][z])
                return true;
            else 
                return false;
        } else if ( x && z ) {
            console.log( "case 2" );
            // array, array, array
            var a = this.check(y[0], y[1], y[2]), 
                b = this.check(x[0], x[1], x[2]), 
                c = this.check(z[0], z[1], z[2]);

            console.log(a, b, c);
            console.log(a || b || c);

            return a || b || c;
        } else {
            console.log( "case 3" );
            // array
            return this.check(y[0], y[1], y[2]);
        }
    } else {
        if ( typeof y === "number" ) {
            // num, num, num
            if (this.blob[y] && this.blob[y][x] && this.blob[y][x][z])
                return true;
            else 
                return false;
        } else if ( x && z ) {
            // array, array, array
            var a = this.check(y[0], y[1], y[2]), 
                b = this.check(x[0], x[1], x[2]), 
                c = this.check(z[0], z[1], z[2]);

            return a || b || c;
        } else {
            // array
            return this.check(y[0], y[1], y[2]);
        }
    }
};
