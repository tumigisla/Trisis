
function Triomino(descr) {
    for (var property in descr)
        this[property] = descr[property];

    this.LShape = util.coinFlip();

    this.rotations = [0.0, 0.0, 0.0];

    this.rotUpdateBuffers = [0.0, 0.0, 0.0];
}

Triomino.prototype.ROT_UPDATE_STEPS = 20;

Triomino.prototype.build = function() {
     this.cube = new Cube();
};

Triomino.prototype.update = function(du) {
    // update here
    for (var i = 0; i < this.rotUpdateBuffers.length; i++) {
        if (rotationUpdate[i][0]) { // increasing
            if (this.rotations[i] < crntCubeRotation[i]) {
                this.rotations[i] += (90 / this.ROT_UPDATE_STEPS) * du;
            console.log('HERE');
            }
            else {
                rotationUpdate[i][0] = false;
            }
        }
        else if (rotationUpdate[i][1]) { // decreasing
            if (this.rotations[i] > crntCubeRotation[i]) {
                this.rotations[i] -= (90 / this.ROT_UPDATE_STEPS) * du;
            }
            else {
                rotationUpdate[i][1] = false;
            }
        }
        else {  // no change    
            this.rotations[i] = crntCubeRotation[i];
        }
    }
};

Triomino.prototype.render = function(mv) {
    var mvStack = [];

    mvStack.push(mv);
        mv = this.rotate(mv);
        this.cube.render(mv);
    mv = mvStack.pop();
    mvStack.push(mv);
        mv = this.rotate(mv);
        mv = mult(mv, translate(0.0, 0.4, 0.0));
        this.cube.render(mv);
    mv = mvStack.pop();
    mvStack.push(mv);
        mv = this.rotate(mv);
        mv = this.LShape ? mult(mv, translate(0.4, 0.0, 0.0)) : 
                    mult(mv, translate(0.0, -0.4, 0.0));
        this.cube.render(mv);
    mv = mvStack.pop();
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