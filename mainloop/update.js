var NOMINAL_UPDATE_INTERVAL = 16.666;

var update = function(dt) {
    var original_dt = dt;
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    updateSimulation(du);
};
