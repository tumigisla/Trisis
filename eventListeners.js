    var addEventListeners = function() {

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();     // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    // Event listeners for keyboard
     window.addEventListener("keydown", function(e){
        keys[e.keyCode] = true; 

        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40)
            e.preventDefault();
     });

     window.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
     });

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         e.preventDefault();

         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );
};

var checkKeyInputs = function() {
    var i, j, change;

    if (util.inRange(util.abs(spinY), 0, 45) || 
        util.inRange(util.abs(spinY), 315, 360)){
        translDecisions = translDec.ver0;
        translGridChanges = translCh.ver0;
    }

    else if (util.inRange(spinY, 45, 135) || 
        util.inRange(spinY, -315, -225)) {
        translDecisions = translDec.ver3;
        translGridChanges = translCh.ver3;
    }

    else if (util.inRange(util.abs(spinY), 135, 225)) {
        translDecisions = translDec.ver2;
        translGridChanges = translCh.ver2;
    }

    else if (util.inRange(spinY, 225, 315) || 
        util.inRange(spinY, -135,  -45)) {
        translDecisions = translDec.ver1;
        translGridChanges = translCh.ver1;
    }

    // Key presses

    // x-translations
    if (keys[37]) { // left arrow
        i = translDecisions[0][1];
        j = translDecisions[0][2];
        change = translDecisions[0][0];
        arrowPressIndex = 3;

        if (!availAxisTransl[i] ||
            !triomino.updateGridCoords()) return; 
        
        updateTranslPerm(change, i, j);
    }
    if (keys[39]) { // right arrow
        i = translDecisions[2][1];
        j = translDecisions[2][2];
        change = translDecisions[2][0];
        arrowPressIndex = 1;

        if (!availAxisTransl[i] ||
            !triomino.updateGridCoords()) return; 
  
        updateTranslPerm(change, i, j);
    }

    // z-translations    
    if (keys[38]) { // up arrow
        i = translDecisions[3][1];
        j = translDecisions[3][2];
        change = translDecisions[3][0];
        arrowPressIndex = 2;

        if (!availAxisTransl[i] ||
            !triomino.updateGridCoords()) return; 

        updateTranslPerm(change, i, j);
    }
    if (keys[40]) { // down arrow
        i = translDecisions[1][1];
        j = translDecisions[1][2];
        change = translDecisions[1][0];
        arrowPressIndex = 0;

        if (!availAxisTransl[i] ||
            !triomino.updateGridCoords()) return;

        updateTranslPerm(change, i, j);
    }

    // Rotations.
    // x-axis
    if (keys[65]) { // a
        if (!availAxisRot[0]) return;            
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[0] += 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(0, 0);
    }
    if (keys[90]) { // z
        if (!availAxisRot[0]) return;
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[0] -= 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(0, 1);
    }

    //y-axis
    if (keys[83]) { // s
        if (!availAxisRot[1]) return;
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[1] += 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(1, 0);
    }
    if (keys[88]) { // x
        if (!availAxisRot[1]) return;
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[1] -= 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(1, 1);
    }

    // z-axis
    if (keys[68]) { // d
        if (!availAxisRot[2]) return;
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[2] += 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(2, 0);
    }
    if (keys[67]) { // c
        if (!availAxisRot[2]) return;
        crntCubeRotationBackup = crntCubeRotation.slice(0);
        crntCubeRotation[2] -= 90;
        if (!triomino.checkRotations()) return;

        updateRotPerm(2, 1);
    }


    // Drop
    if (eatKey(76)) // L button
        triomino.isDropping = !triomino.isDropping;

    // Init dropping
    if (eatKey(73)) { // i button
        triomino.dropLevel = 0.0;
        triomino.isDropping = false;
    }    

    // Faster dropping
    if (keys[32]) {
        if (triomino.DROP_UPDATE_STEPS > 10)
            triomino.DROP_UPDATE_STEPS -= 3.0;
    }

    else
        if (triomino.DROP_UPDATE_STEPS < 60)
            triomino.DROP_UPDATE_STEPS += 10.0;

};

var updateTranslPerm = function(change, i, j) {
    crntCubeTransl[i] += change;
    translUpdate[i][j] = true;
    availAxisTransl[i] = false;
};

var updateRotPerm = function(i, j) {
    rotationUpdate[i][j] = true;
    availAxisRot[i] = false;
};

var eatKey = function(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
};