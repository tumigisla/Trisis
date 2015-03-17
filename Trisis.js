// Globals
var canvas, gl, program, texture;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = 5.0;

var proLoc;
var mvLoc;

// Setup the necessities
var setup = function() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert("WebGL isn't available");}

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    proLoc = gl.getUniformLocation(program, "projection");
    mvLoc = gl.getUniformLocation(program, "modelview");

    var proj = perspective(50.0, 1.0, 0.2, 100.0);
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
};

///////////////////////////////////
var updateSimulation = function(du) {
    // update
};

var renderSimulation = function() {
    // render
};

// Start the game
window.onload = function init() {
    setup();
    main.init();
};