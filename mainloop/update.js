var NOMINAL_UPDATE_INTERVAL = 16.666;
var paused = false, gameover = false;

var update = function(dt) {
    if (eatKey(80)) { // P button
        paused = !paused;
    }

    if (paused || gameover)
        return;

    var original_dt = dt;
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    updateSimulation(du);
};