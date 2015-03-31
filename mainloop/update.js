var NOMINAL_UPDATE_INTERVAL = 16.666;
var paused = false;

var update = function(dt) {
    if (eatKey(80)) { // P button
        paused = !paused;
    }

    if (paused)
        return;

    var original_dt = dt;
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    updateSimulation(du);
};
