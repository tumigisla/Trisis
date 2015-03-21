var keys = [];

var handleKeydown = function(e) {
    keys[e.keyCode] = true;
};

var handleKeyup = function(e) {
    keys[e.keyCode] = false;
};