// Globals
var canvas, gl, program, texture;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = 5.0;

var proLoc, mvLoc;

var vPosition, vTexCoord;

var textureImgs = [];

var cube;

// Setup the necessities
var setup = function() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert("WebGL isn't available");}

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Test cube
    cube = new Cube({image : textureImgs[0]});
    cube.build();
    cube.loadToGPU();

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
    textureImgs.push(document.getElementById("circuitBoard"));
};

///////////////////////////////////
var updateSimulation = function(du) {
    // update
};

var renderSimulation = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotate( parseFloat(spinX), [1, 0, 0] ) );
    mv = mult( mv, rotate( parseFloat(spinY), [0, 1, 0] ) );
    
    cube.render(mv);
};

// Start the game
window.onload = function init() {
    loadTextures();
    setup();
    main.init();
};