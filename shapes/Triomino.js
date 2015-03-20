
function Triomino(descr) {
    for (var property in descr)
        this[property] = descr[property];

    this.LShape = util.coinFlip();

    this.rotations = crntCubeRotation;
}

Triomino.prototype.build = function() {
     this.cube = new Cube();
};

Triomino.prototype.update = function(du) {
    // update here
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
    this.rotations = crntCubeRotation;
    mv = mult(mv, rotate(this.rotations[0], [1, 0, 0]));    // x-axis
    mv = mult(mv, rotate(this.rotations[1], [0, 1, 0]));    // y-axis
    mv = mult(mv, rotate(this.rotations[2], [0, 0, 1]));    // z-axis
    return mv;
};