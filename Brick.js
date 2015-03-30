/////////////////////////////////////////////////////////////////
// ??
/////////////////////////////////////////////////////////////////

function Brick(descr) {
    // descr must include:
    //     image
    //     y, x, z grid index

    for(var property in descr)
        this[property] = descr[property];

    var gs = grid.gridSize;

    this.translations = [
        this.x * gs,
        this.y * gs,
        this.z * gs
    ];
}