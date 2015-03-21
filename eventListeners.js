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

    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
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

         switch( e.keyCode ) {
            // x-movement
            case 37:    // left arrow
                i = translDecisions[0][1];
                j = translDecisions[0][2];
                change = translDecisions[0][0];

                crntCubeTransl[i] += change;
                translUpdate[i][j] = true;

                availAxisTransl[i] = 

                e.preventDefault();
                break;
            case 39:    // right arrow
                i = translDecisions[2][1];
                j = translDecisions[2][2];
                change = translDecisions[2][0];

                crntCubeTransl[i] += change;
                translUpdate[i][j] = true;

                e.preventDefault();
                break;

            // z-movement    
            case 38:    // up arrow
                i = translDecisions[3][1];
                j = translDecisions[3][2];
                change = translDecisions[3][0];

                crntCubeTransl[i] += change;
                translUpdate[i][j] = true;

                e.preventDefault();
                break;
            case 40:    // down arrow
                i = translDecisions[1][1];
                j = translDecisions[1][2];
                change = translDecisions[1][0];

                crntCubeTransl[i] += change;
                translUpdate[i][j] = true;

                e.preventDefault();
                break;

            // Rotations of the current cube.
            // x-axis
            case 65:    // a
                crntCubeRotation[0] += 90;
                rotationUpdate[0][0] = true;
                break;
            case 90:    // z
                crntCubeRotation[0] -= 90;
                rotationUpdate[0][1] = true;
                break;
            //y-axis
            case 83:    // s
                crntCubeRotation[1] += 90;
                rotationUpdate[1][0] = true;
                break;
            case 88:    // x
                crntCubeRotation[1] -= 90;
                rotationUpdate[1][1] = true;
                break;
            // z-axis
            case 68:    // d
                crntCubeRotation[2] += 90;
                rotationUpdate[2][0] = true;
                break;
            case 67:    // c
                crntCubeRotation[2] -= 90;
                rotationUpdate[2][1] = true;
                break;
         }
     }  );

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