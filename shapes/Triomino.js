var crntHeights;

function Triomino(descr) {
    for (var property in descr)
        this[property] = descr[property];

    this.LShape = util.coinFlip();
    //this.LShape = false;

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

    crntHeights = this.LShape ? [19, 18, 18] : [19, 18, 17];
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
    
    if (this.isDropping) {
        this.dropLevel -= (0.4 / this.DROP_UPDATE_STEPS) * du;
    }
    else {
        this.dropLevel -= (this.dropLevel % (-0.4));  // clamp to last index
    }
    // Grid coords update for dropping
    /*
    for (var coords of this.crntCoords) {
        var index = this.crntCoords.indexOf(coords);
        coords[0] = crntHeights[index] + Math.ceil(this.dropLevel / 0.4);
    }
    */
};


Triomino.prototype.updateGridCoords = function() {
    var shouldUpdate = [true, true, true];
    for (var coords of this.crntCoords) {
        var change = translGridChanges[arrowPressIndex];
        for (var i = 1; i < change.length; i++) {
            if (!(coords[i] + change[i] >= 0 &&
                coords[i] + change[i] <= 5)) { // Make this prettier if possible.
                shouldUpdate[i] = false;
            }
        }
    }
    for (var su of shouldUpdate) {
        if (!su)
            return false;
    }
    // We can only get to here if shouldUpdate === [true, true, true]
    for (var coords of this.crntCoords) {
        var change = translGridChanges[arrowPressIndex];
        for (var i = 0; i < change.length; i++)
            coords[i] += change[i];
    }

    return true;
};

var didUpdateRotation = false;

// Update grid coords relative to the current rotation.
Triomino.prototype.checkRotations = function() {
    var xRot = util.abs(crntCubeRotation[0] % 360),
        yRot = util.abs(crntCubeRotation[1] % 360),
        zRot = util.abs(crntCubeRotation[2] % 360);

    if (this.LShape)
        this.lShapeRot(xRot, yRot, zRot);
    else
        this.regularShapeRot(xRot, yRot, zRot);

    return didUpdateRotation;
};

Triomino.prototype.lShapeRot = function(xRot, yRot, zRot) {
    var xOdd = xRot === 90 || xRot === 270,
        yOdd = yRot === 90 || yRot === 270,
        zOdd = zRot === 90 || zRot === 270;

    var xEven = xRot === 180,
        yEven = yRot === 180,
        zEven = zRot === 180;

    var xZero = xRot === 0,
        yZero = yRot === 0,
        zZero = zRot === 0;

    var oldCoords = this.crntCoords.slice(0);
    var newCoords;

    if      (xZero && yZero && zZero)   newCoords = this.changeCoordsLShape([[0,1], [1,1]], oldCoords);    // 18, i+1, j+1
    else if (xEven && yZero && zZero)   newCoords = this.changeCoordsLShape([[0,-1], [1,1]], oldCoords);   // 19, i-1, j+1
    else if (xEven && yEven && zZero)   newCoords = this.changeCoordsLShape([[0,-1],[2,-1]], oldCoords);   // 20, i-1, k-1
    else if (xEven && yEven && zEven)   newCoords = this.changeCoordsLShape([[0,1], [1,1]], oldCoords);    // 21, i+1, j+1
    else if (xZero && yEven && zZero)   newCoords = this.changeCoordsLShape([[0,1], [1,-1]], oldCoords);   // 22, i+1, j-1
    else if (xZero && yZero && zEven)   newCoords = this.changeCoordsLShape([[0,-1], [1,-1]], oldCoords);  // 23, i-1, j-1
    else if (xZero && yEven && zEven)   newCoords = this.changeCoordsLShape([[0,-1], [1,1]], oldCoords);   // 24, i-1, j+1
    else if (xZero && yZero && zOdd)    newCoords = this.changeCoordsLShape([[0,-1], [1,1]], oldCoords);   // 25, i-1, j+1
    else if (xEven && yZero && zOdd)    newCoords = this.changeCoordsLShape([[0,1], [1,1]], oldCoords);    // 26, i+1, j+1
    else if (xZero && yEven && zOdd)    newCoords = this.changeCoordsLShape([[0,-1], [1,-1]], oldCoords);  // 27, i-1, j-1
    else if (xEven && yEven && zOdd)    newCoords = this.changeCoordsLShape([[0,1], [1,-1]], oldCoords);   // 28, i+1, j-1
    else if (xZero && yOdd && zZero)    newCoords = this.changeCoordsLShape([[0,1], [2,-1]], oldCoords);   // 29, i+1, k-1
    else if (xEven && yOdd && zZero)    newCoords = this.changeCoordsLShape([[0,-1], [2,-1]], oldCoords);  // 30, i-1, k-1
    else if (xZero && yOdd && zEven)    newCoords = this.changeCoordsLShape([[0,-1], [2,-1]], oldCoords);  // 31, i-1, k-1
    else if (xEven && yOdd && zEven)    newCoords = this.changeCoordsLShape([[0,1], [2,1]], oldCoords);    // 32, i+1, k+1
    else if (xZero && yOdd && zOdd)     newCoords = this.changeCoordsLShape([[0,-1], [2,1]], oldCoords);   // 33, i-1, k+1
    else if (xEven && yOdd && zOdd)     newCoords = this.changeCoordsLShape([[0,1], [2,-1]], oldCoords);   // 34, i+1, k-1
    else if (xOdd && yZero && zZero)    newCoords = this.changeCoordsLShape([[2,-1], [1, 1]], oldCoords);  // 35, k-1, j+1
    else if (xOdd && yEven && zZero)    newCoords = this.changeCoordsLShape([[2,-1], [1,-1]], oldCoords);  // 36, k-1, j-1
    else if (xOdd && yZero && zEven)    newCoords = this.changeCoordsLShape([[2,1], [1,-1]], oldCoords);   // 37, k+1, j-1
    else if (xOdd && yEven && zEven)    newCoords = this.changeCoordsLShape([[2,1], [1,1]], oldCoords);    // 38, k+1, j+1
    else if (xOdd && yZero && zOdd)     newCoords = this.changeCoordsLShape([[2,1], [1,1]], oldCoords);    // 39, k+1, j+1
    else if (xOdd && yEven && zOdd)     newCoords = this.changeCoordsLShape([[2,1], [1,-1]], oldCoords);   // 40, k+1, j-1
    else if (xOdd && yOdd && zZero)     newCoords = this.changeCoordsLShape([[0,1], [2,-1]], oldCoords);   // 41, i+1, k-1
    else if (xOdd && yOdd && zEven)     newCoords = this.changeCoordsLShape([[0,-1], [2,1]], oldCoords);   // 42, i-1, k+1
    else if (xOdd && yOdd && zOdd)      newCoords = this.changeCoordsLShape([[0,1], [2,1]], oldCoords);    // 43, i+1, k+1

    didUpdateRotation = !(newCoords === oldCoords); 
    
    this.crntCoords = newCoords ? newCoords : oldCoords;

    if (!didUpdateRotation) crntCubeRotation = crntCubeRotationBackup;
};

// dims is and array of two dimensions.
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

Triomino.prototype.regularShapeRot = function(xRot, yRot, zRot) {
    var xTurning = xRot === 90 || xRot === 270,
        yTurning = yRot === 90 || yRot === 270,
        zTurning = zRot === 90 || zRot === 270;

    var oldCoords = this.crntCoords.slice(0);
    var newCoords = oldCoords.slice(0);

    if (xTurning) {
        if (yTurning) {
            if (zTurning)   newCoords = this.changeCoords(0, oldCoords);   // i +- 1
            else            newCoords = this.changeCoords(2, oldCoords);   // k +- 1
        }
        else if (zTurning)  newCoords = this.changeCoords(1, oldCoords);   // j +- 1
        else                newCoords = this.changeCoords(2, oldCoords);   // k +- 1
    }
    else if (yTurning) {
        if (zTurning)       newCoords = this.changeCoords(2, oldCoords);   // k +- 1
        else                newCoords = this.changeCoords(0, oldCoords);   // i +- 1
    }
    else if (zTurning)      newCoords = this.changeCoords(1, oldCoords);   // j +- 1

    else { // 0  or 180 rotations
        newCoords = this.changeCoords(0, oldCoords);
    }

    didUpdateRotation = !(newCoords === oldCoords); 

    this.crntCoords = newCoords ? newCoords : oldCoords;

    //console.log(didUpdateRotation);

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

// dim is 0, 1, 2 indicating i, j, k
Triomino.prototype.changeCoords = function(dim, coords) {
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


Triomino.prototype.render = function(mv) {
    var mvStack = [];

    mvStack.push(mv);   // middle cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        this.cube.render(mv);
    mv = mvStack.pop();
    mvStack.push(mv);   // top cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        mv = mult(mv, translate(0.0, 0.4, 0.0));
        this.cube.render(mv);
    mv = mvStack.pop();
    mvStack.push(mv);   // btm cube
        mv = this.drop(mv);
        mv = this.translate(mv);
        mv = this.rotate(mv);
        mv = this.LShape ? mult(mv, translate(0.4, 0.0, 0.0)) : 
                    mult(mv, translate(0.0, -0.4, 0.0));
        this.cube.render(mv);
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