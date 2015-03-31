// Globals
var canvas, gl, program, texture;

var movement = false;
var spinX = 30;
var spinY = 0;
var origX;
var origY;

var zDist = 10.0;

var proLoc, mvLoc;

var vPosition, vTexCoord;

var textureImgs = [];

var triomino;
var grid;
var bricks;

var crntCubeRotationBackup, crntCubeRotation, rotationUpdate,
    crntCubeTransl, translUpdate, translDecisions,
    availAxisTransl, availAxisRot, translGridChanges;

// 0 = down, 1 = right, 2 = up, 3 = left
var arrowPressIndex;

var keys = [];

var score = 0;

// Setup the necessities
var setup = function() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert("WebGL isn't available");}

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.18, 0.18, 0.18, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    triomino = new Triomino();
    triomino.build();
    triomino.cube.loadToGPU();

    grid = new Grid();
    grid.loadToGPU();

    bricks = new Bricks();
    bricks.build();
    bricks.cube.loadToGPU();

    // For debugging

     for (var i = 0; i < 5; i++) {
         for (var j = 0; j < 6; j++) {
             bricks.add(0,i,j,textureImgs[0]);
         }
     }for (var i = 0; i < 5; i++) {
         for (var j = 0; j < 6; j++) {
             bricks.add(1,i,j,textureImgs[0]);
         }
     }
     bricks.levelsWithCubes.push(0);
     bricks.levelsWithCubes.push(1);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.enableVertexAttribArray( vTexCoord );

    proLoc = gl.getUniformLocation(program, "projection");
    mvLoc = gl.getUniformLocation(program, "modelview");

    var proj = perspective(50.0, 1.0, 0.2, 100.0);
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    addEventListeners();
};

var loadTextures = function() {
    textureImgs.push(document.getElementById("circuitBoard-blue"));
    textureImgs.push(document.getElementById("circuitBoard-red"));
    textureImgs.push(document.getElementById("circuitBoard-green"));
    textureImgs.push(document.getElementById("shadow"));
    textureImgs.push(document.getElementById("grid-box"));
};

///////////////////////////////////
var updateSimulation = function(du) {
    checkKeyInputs();
    triomino.update(du);
    bricks.update(du);
};

var renderSimulation = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt(
        vec3(0.0, 0.0, zDist), //  eye
        vec3(0.0, -1.0, 0.0),  //  at
        vec3(0.0, 1.0, 0.0)    //  up
    );
    mv = mult( mv, rotate( parseFloat(spinX), [1, 0, 0] ) );
    mv = mult( mv, rotate( parseFloat(spinY), [0, 1, 0] ) );

    triomino.render(mv);
    grid.render(mv);
    bricks.render(mv);
};

// Start the game
window.onload = function init() {
    loadTextures();
    setup();
    main.init();
};
