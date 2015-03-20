
function Triomino(descr) {
	for (var property in descr)
		this[property] = descr[property];

	this.LShape = util.coinFlip();
}

Triomino.prototype.build = function() {
	 this.cube = new Cube();
};

Triomino.prototype.update = function(du) {
	// update here
};

Triomino.prototype.render = function(mv) {
	this.cube.render(mv);
    mv = mult(mv, translate(0.0, -0.4, 0.0));
    this.cube.render(mv);
    mv = this.LShape ? mult(mv, translate(0.4, 0.0, 0.0)) : mult(mv, translate(0.0, -0.4, 0.0));
    this.cube.render(mv);
};