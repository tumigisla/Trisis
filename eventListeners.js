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

    if (util.inRange(util.abs(spinY), 0, 45) || util.inRange(util.abs(spinY), 315, 360)){
        translDecisions = translDec.ver0;
    }

    else if (util.inRange(spinY, 45, 135) || util.inRange(spinY, -315, -225)) {
        translDecisions = translDec.ver3;
    }

    else if (util.inRange(util.abs(spinY), 135, 225)) {
        translDecisions = translDec.ver2;
    }

    else if (util.inRange(spinY, 225, 315) || util.inRange(spinY, -135,  -45)) {
        translDecisions = translDec.ver1;
    }

    // Key presses

    // x-translations
    if (keys[37]) { // left arrow
        i = translDecisions[0][1];
        j = translDecisions[0][2];
        change = translDecisions[0][0];

        if (!availAxisTransl[i]) return; 
        
        crntCubeTransl[i] += change;
        translUpdate[i][j] = true;
        availAxisTransl[i] = false;
    }
    if (keys[39]) { // right arrow
        i = translDecisions[2][1];
        j = translDecisions[2][2];
        change = translDecisions[2][0];

        if (!availAxisTransl[i]) return;
            
        crntCubeTransl[i] += change;
        translUpdate[i][j] = true;
        availAxisTransl[i] = false;
    }

    // z-translations    
    if (keys[38]) { // up arrow
        i = translDecisions[3][1];
        j = translDecisions[3][2];
        change = translDecisions[3][0];

        if (!availAxisTransl[i]) return;
        
        crntCubeTransl[i] += change;
        translUpdate[i][j] = true;
        availAxisTransl[i] = false;
    }
    if (keys[40]) { // down arrow
        i = translDecisions[1][1];
        j = translDecisions[1][2];
        change = translDecisions[1][0];

        if (!availAxisTransl[i]) return;
        
        crntCubeTransl[i] += change;
        translUpdate[i][j] = true;
        availAxisTransl[i] = false;
    }

    // Rotations of the current cube.
    // x-axis
    if (keys[65]) { // a
        if (!availAxisRot[0]) return;            
        
        crntCubeRotation[0] += 90;
        rotationUpdate[0][0] = true;
        availAxisRot[0] = false;
    }
    if (keys[90]) { // z
        if (!availAxisRot[0]) return;
        
        crntCubeRotation[0] -= 90;
        rotationUpdate[0][1] = true;
        availAxisRot[0] = false;
    }

    //y-axis
    if (keys[83]) { // s
        if (!availAxisRot[1]) return;
        
        crntCubeRotation[1] += 90;
        rotationUpdate[1][0] = true;
        availAxisRot[1] = false;
    }
    if (keys[88]) { // x
        if (!availAxisRot[1]) return;
        
        crntCubeRotation[1] -= 90;
        rotationUpdate[1][1] = true;
        availAxisRot[1] = false;
    }

    // z-axis
    if (keys[68]) { // d
        if (!availAxisRot[2]) return;

        crntCubeRotation[2] += 90;
        rotationUpdate[2][0] = true;
        availAxisRot[2] = false;
    }
    if (keys[67]) { // c
        if (!availAxisRot[2]) return;

        crntCubeRotation[2] -= 90;
        rotationUpdate[2][1] = true;
        availAxisRot[2] = false;
    }
};