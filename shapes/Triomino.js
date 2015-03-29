function Triomino(descr) {
    for (var property in descr)
        this[property] = descr[property];

    this.LShape = util.coinFlip();
    //this.LShape = true;

    this.rotations = [0.0, 0.0, 0.0];
    this.rotUpdateBuffers = [0.0, 0.0, 0.0];

    // x-axis, z-axis
    this.translations = [0.0, 0.0]; 
    this.translUpdateBuffers = [0.0, 0.0];

    this.isDropping = false;
    this.dropLevel = 0.0;

    this.image = this.LShape ? textureImgs[0] : textureImgs[1];

    this.topCoords = [19, 3, 3];
    this.midCoords = [18, 3, 3];
    this.btmCoords = this.LShape ? [18, 4 , 3] : [17, 3, 3];

    this.crntCoords = [this.topCoords, this.midCoords, this.btmCoords];
}

Triomino.prototype.ROT_UPDATE_STEPS = 15;
Triomino.prototype.TRANSL_UPDATE_STEPS = 15;
Triomino.prototype.DROP_UPDATE_STEPS = 60;

Triomino.prototype.build = function() {
     this.cube = new Cube({image : this.image});
};

Triomino.prototype.update = function(du) {
    // Generalize this. Rotation and translation are doing
    // exactly the same thing.

    // Rotation
    
    for (var i = 0; i < this.rotUpdateBuffers.length; i++) {
        if (rotationUpdate[i][0]) { // increasing
            if (this.rotations[i] < crntCubeRotation[i])
                this.rotations[i] += (90 / this.ROT_UPDATE_STEPS) * du;
            else {
                rotationUpdate[i][0] = false;
                availAxisRot[i] = true;
            }
        }
        else if (rotationUpdate[i][1]) { // decreasing
            if (this.rotations[i] > crntCubeRotation[i])
                this.rotations[i] -= (90 / this.ROT_UPDATE_STEPS) * du;
            else {
                rotationUpdate[i][1] = false;
                availAxisRot[i] = true;
            }
        }
        else // no change    
            this.rotations[i] = crntCubeRotation[i];
    }
    

    // Translation
    for (var i = 0; i < this.translUpdateBuffers.length; i++) {
        if (translUpdate[i][0]) { // decreasing
            if (this.translations[i] > crntCubeTransl[i])
                this.translations[i] -= (0.4 / this.TRANSL_UPDATE_STEPS) * du;
            else {
                translUpdate[i][0] = false;
                availAxisTransl[i] = true;
            }
        }
        else if (translUpdate[i][1]) { // increasing
            if (this.translations[i] < crntCubeTransl[i])
                this.translations[i] += (0.4 / this.TRANSL_UPDATE_STEPS) * du;
            else {
                translUpdate[i][1] = false;
                availAxisTransl[i] = true;
            }
        }
        else // no change
            this.translations[i] = crntCubeTransl[i];
    }

    // Dropping

    var isColliding = this.collideCheck();

    var oldDropLevel = this.dropLevel;
    
    if (this.isDropping) {
        this.dropLevel -= (0.4 / this.DROP_UPDATE_STEPS) * du;
    }
    else {
        // clamp to last index
        this.dropLevel = util.roundDown(this.dropLevel, -0.4);
    }
    
    var collide = this.collideCheck();
    if (!isColliding && collide) {
        this.dropLevel = oldDropLevel;
        //console.log("collide", collide);
    }
};

Triomino.prototype.collideCheck = function () {
    var scaleDL = this.dropLevel / -0.4;

    var checkCoords = [
        [this.crntCoords[0][0], this.crntCoords[0][1], this.crntCoords[0][2]],
        [this.crntCoords[1][0], this.crntCoords[1][1], this.crntCoords[1][2]],
        [this.crntCoords[2][0], this.crntCoords[2][1], this.crntCoords[2][2]]
    ];
    checkCoords[0][0] -= Math.ceil(scaleDL);
    checkCoords[1][0] -= Math.ceil(scaleDL);
    checkCoords[2][0] -= Math.ceil(scaleDL);

    if (keys["Y".charCodeAt(0)]) {
        console.log("checkCoords", checkCoords);
    }

    // check for floor hit
    if (checkCoords[0][0] < 0, checkCoords[1][0] < 0, checkCoords[2][0] < 0) {
        //console.log("floor hit");
        return "floor";
    }
    if ( bricks.check(checkCoords) ) {
        //console.log("blob hit");
        return "blob";
    }
}


Triomino.prototype.updateGridCoords = function() {
    var scaleDL = this.dropLevel / -0.4;

    var checkCoords = [
        [this.crntCoords[0][0], this.crntCoords[0][1], this.crntCoords[0][2]],
        [this.crntCoords[1][0], this.crntCoords[1][1], this.crntCoords[1][2]],
        [this.crntCoords[2][0], this.crntCoords[2][1], this.crntCoords[2][2]]
    ];
    checkCoords[0][0] -= Math.ceil(scaleDL);
    checkCoords[1][0] -= Math.ceil(scaleDL);
    checkCoords[2][0] -= Math.ceil(scaleDL);

    var shouldUpdate = [true, true, true];

    for (var coords of checkCoords) {
        var change = translGridChanges[arrowPressIndex];
        for (var i = 1; i < change.length; i++) {
            coords[i] += change[i];
        }
    }

    if (bricks.check(checkCoords) || !this.insideBounds(checkCoords)) {
        console.log("crashing blob from side or crashing the walls");
        return false;
    }
    else {
        for (var coords of this.crntCoords) {
            var change = translGridChanges[arrowPressIndex];
            for (var i = 1; i < change.length; i++)
                coords[i] += change[i];
        }
        return true;
    }
};


var didUpdateRotation = false;

// Update grid coords relative to the current rotation.
Triomino.prototype.checkRotations = function() {
    var xRot = util.abs(crntCubeRotation[0] % 360),
        yRot = util.abs(crntCubeRotation[1] % 360),
        zRot = util.abs(crntCubeRotation[2] % 360);

    if (this.LShape)
        this.lShapeRot();
    else
        this.regularShapeRot(xRot, yRot, zRot);

    return didUpdateRotation;
};

// dims is and array of two dimensions.
// f.ex. dims = [[0,1], [1,1]]
// indicates i+1 and j+1.
// 0,1,2 is i,j,k (y,x,z)
Triomino.prototype.changeCoordsLShape = function(dims, coords) {

    var tmpCoords = [[], coords[1], []];
    
    var dim0 = dims[0],
        dim1 = dims[1];

    for (var i = 0; i < coords.length; i++) {
        if (i === dim0[0]) {
            tmpCoords[0][i] = coords[1][i] + dim0[1];
            tmpCoords[2][i] = coords[1][i];
        }
        else if (i === dim1[0]) {
            tmpCoords[0][i] = coords[1][i];
            tmpCoords[2][i] = coords[1][i] + dim1[1];
        }
        else {
            tmpCoords[0][i] = coords[1][i];
            tmpCoords[2][i] = coords[1][i];
        }
    }

    if (this.insideBounds(tmpCoords)) return tmpCoords;
    return coords;
};

Triomino.prototype.lShapeRot = function() {

    var xRot = crntCubeRotation[0] % 360,
        yRot = crntCubeRotation[1] % 360,
        zRot = crntCubeRotation[2] % 360;

    var xZero = xRot === 0,
        yZero = yRot === 0,
        zZero = zRot === 0;

    var xOdd1 = xRot === 90 || xRot === -270,
        yOdd1 = yRot === 90 || yRot === -270,
        zOdd1 = zRot === 90 || zRot === -270;

    var xEven = util.abs(xRot) === 180,
        yEven = util.abs(yRot) === 180,
        zEven = util.abs(zRot) === 180;

    var xOdd2 = xRot === 270 || xRot === -90,
        yOdd2 = yRot === 270 || yRot === -90,
        zOdd2 = zRot === 270 || zRot === -90;

    var oldCoords = this.crntCoords.slice(0);
    var newCoords;


    if (
            (xZero && yZero && zZero) || (xZero && yEven && zOdd1) ||
            (xEven && yZero && zOdd2) || (xEven && yEven && zEven)
        )
        newCoords = this.changeCoordsLShape([[0,1],[1,1]], oldCoords); // i+1, j+1
    else if (
            (xZero && yZero && zOdd1) || (xZero && yEven && zZero) ||
            (xEven && yZero && zEven) || (xEven && yEven && zOdd2)
        )
        newCoords = this.changeCoordsLShape([[0,1], [1,-1]], oldCoords); // i+1, j-1
    else if (
            (xZero && yZero && zEven) || (xZero && yEven && zOdd2) ||
            (xEven && yZero && zOdd1) || (xEven && yEven && zZero)
        )
        newCoords = this.changeCoordsLShape([[0,-1], [1,-1]], oldCoords); // i-1, j-1
    else if (
            (xZero && yZero && zOdd2) || (xZero && yEven && zEven) ||
            (xEven && yZero && zZero) || (xEven && yEven && zOdd1)
        )
        newCoords = this.changeCoordsLShape([[0,-1], [1,1]], oldCoords); // i-1, j+1


    else if (
            (xZero && yOdd1 && zZero) || (xZero && yOdd2 && zOdd1) ||
            (xOdd1 && yOdd1 && zOdd2) || (xOdd1 && yOdd2 && zEven) ||
            (xOdd1 && yOdd1 && zEven) || (xOdd1 && yOdd2 && zOdd2) ||
            (xOdd2 && yOdd1 && zOdd1) || (xOdd2 && yOdd2 && zZero)
        )
        newCoords = this.changeCoordsLShape([[0,1], [2,-1]], oldCoords); // i+1, k-1
    else if (
            (xZero && yOdd1 && zOdd1) || (xZero && yOdd2 && zZero) ||
            (xOdd1 && yOdd1 && zZero) || (xOdd1 && yOdd2 && zOdd1) ||
            (xEven && yOdd1 && zOdd2) || (xEven && yOdd2 && zEven) ||
            (xOdd2 && yOdd1 && zEven) || (xOdd2 && yOdd2 && zOdd2)
        )
        newCoords = this.changeCoordsLShape([[0,1], [2,1]], oldCoords); // i+1, k+1
    else if (
            (xZero && yOdd1 && zEven) || (xZero && yOdd2 && zOdd2) ||
            (xOdd1 && yOdd1 && zOdd1) || (xOdd1 && yOdd2 && zZero) ||
            (xEven && yOdd1 && zZero) || (xEven && yOdd2 && zOdd1) ||
            (xOdd1 && yOdd2 && zOdd1) || (xOdd2 && yOdd2 && zEven)
        )
        newCoords = this.changeCoordsLShape([[0,-1], [2,1]], oldCoords); // i-1, k+1
    else if (
            (xZero && yOdd1 && zOdd2) || (xZero && yOdd2 && zEven) ||
            (xOdd1 && yOdd1 && zEven) || (xOdd1 && yOdd2 && zOdd2) ||
            (xEven && yOdd1 && zOdd1) || (xEven && yOdd2 && zZero) ||
            (xOdd2 && yOdd1 && zZero) || (xOdd2 && yOdd2 && zOdd1)
        )
        newCoords = this.changeCoordsLShape([[0,-1], [2,-1]], oldCoords); // i-1, k-1
    

    else if (
            (xOdd1 && yZero && zZero) || (xOdd1 && yEven && zOdd1) ||
            (xOdd2 && yZero && zOdd2) || (xOdd2 && yEven && zEven)
        )
        newCoords = this.changeCoordsLShape([[1,1], [2,1]], oldCoords); // j+1, k+1
    else if (
            (xOdd1 && yZero && zOdd1) || (xOdd1 && yEven && zZero) ||
            (xOdd2 && yZero && zEven) || (xOdd2 && yEven && zOdd2)
        )
        newCoords = this.changeCoordsLShape([[1,-1], [2,1]], oldCoords); // j-1, k+1
    else if (
            (xOdd1 && yZero && zEven) || (xOdd1 && yEven && zOdd2) ||
            (xOdd2 && yZero && zOdd1) || (xOdd2 && yEven && zZero)
        )
        newCoords = this.changeCoordsLShape([[1,-1], [2,-1]], oldCoords); // j-1, k-1
    else if (
            (xOdd1 && yZero && zOdd2) || (xOdd1 && yEven && zEven) ||
            (xOdd2 && yZero && zZero) || (xOdd2 && yEven && zOdd1)
        )
        newCoords = this.changeCoordsLShape([[1,1], [2,-1]], oldCoords); // j+1, k-1


    didUpdateRotation = !(newCoords === oldCoords); 
    
    this.crntCoords = newCoords ? newCoords : oldCoords;

    if (!didUpdateRotation) crntCubeRotation = crntCubeRotationBackup;
};

// dim is 0, 1, 2 indicating i, j, k
Triomino.prototype.changeCoordsRegShape = function(dim, coords) {
    // Leave out the mid cube because it's
    // coords are always the same when rotating.
    // The other cubes always change relative
    // to the mid cube.

    var tmpCoords = [[],coords[1],[]];

    for (var i = 0; i < coords.length; i++) {
        if (i === dim) {
            tmpCoords[0][i] = coords[1][i] + 1;
            tmpCoords[2][i] = coords[1][i] - 1;
        }
        else { // don't change the mid cube
            tmpCoords[0][i] = coords[1][i];
            tmpCoords[2][i] = coords[1][i];
        }
    }

    //console.log(dim, tmpCoords);
    if (this.insideBounds(tmpCoords)) return tmpCoords;
    return coords;
};


Triomino.prototype.regularShapeRot = function(xRot, yRot, zRot) {
    var xTurning = xRot === 90 || xRot === 270,
        yTurning = yRot === 90 || yRot === 270,
        zTurning = zRot === 90 || zRot === 270;

    var oldCoords = this.crntCoords.slice(0);
    var newCoords = oldCoords.slice(0);

    if (xTurning) {
        if (yTurning) {
            if (zTurning)   newCoords = this.changeCoordsRegShape(0, oldCoords);   // i +- 1
            else            newCoords = this.changeCoordsRegShape(2, oldCoords);   // k +- 1
        }
        else if (zTurning)  newCoords = this.changeCoordsRegShape(1, oldCoords);   // j +- 1
        else                newCoords = this.changeCoordsRegShape(2, oldCoords);   // k +- 1
    }
    else if (yTurning) {
        if (zTurning)       newCoords = this.changeCoordsRegShape(2, oldCoords);   // k +- 1
        else                newCoords = this.changeCoordsRegShape(0, oldCoords);   // i +- 1
    }
    else if (zTurning)      newCoords = this.changeCoordsRegShape(1, oldCoords);   // j +- 1

    else { // 0  or 180 rotations
        newCoords = this.changeCoordsRegShape(0, oldCoords);
    }

    didUpdateRotation = !(newCoords === oldCoords); 

    this.crntCoords = newCoords ? newCoords : oldCoords;

    if (!didUpdateRotation) crntCubeRotation = crntCubeRotationBackup;
};

Triomino.prototype.insideBounds = function(coords) {
    for (var c = 0; c < coords.length; c++) {
        var inBounds_i = coords[c][0] >= 0 &&
                         coords[c][0] <= 19,
            inBounds_j = coords[c][1] >= 0 &&
                         coords[c][1] <= 5,
            inBounds_k = coords[c][2] >= 0 &&
                         coords[c][2] <= 5;

        if (!(inBounds_i && inBounds_j && inBounds_k)) {
            return false;
        }
    }
    return true;
};

Triomino.prototype.render = function(mv) {
    var mvStack = [];

    mvStack.push(mv);   // middle cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        this.cube.render(mv);
        this.mvs[1] = mv;
    mv = mvStack.pop();
    mvStack.push(mv);   // top cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        mv = mult(mv, translate(0.0, 0.4, 0.0));
        this.cube.render(mv);
        this.mvs[0] = mv;
    mv = mvStack.pop();
    mvStack.push(mv);   // btm cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        mv = this.LShape ? mult(mv, translate(0.4, 0.0, 0.0)) : 
                    mult(mv, translate(0.0, -0.4, 0.0));
        this.cube.render(mv);
        this.mvs[2] = mv;
    mv = mvStack.pop();
};

Triomino.prototype.drop = function(mv) {
    mv = mult(mv, translate(0.0, this.dropLevel, 0.0));
    return mv;
};

Triomino.prototype.translate = function(mv) {
    // translate here
    if (!(this.translations[0] === 0 && this.translations[1] === 0))
        mv = mult(mv, translate(this.translations[0], 0.0, this.translations[1]));
    return mv;
};

Triomino.prototype.rotate = function(mv) {
    //this.rotations = crntCubeRotation;
    if (this.rotations[0] !== 0)
        mv = mult(mv, rotate(this.rotations[0], [1, 0, 0]));    // x-axis
    if (this.rotations[1] !== 0)
        mv = mult(mv, rotate(this.rotations[1], [0, 1, 0]));    // y-axis
    if (this.rotations[2] !== 0)
        mv = mult(mv, rotate(this.rotations[2], [0, 0, 1]));    // z-axis
    return mv;
};