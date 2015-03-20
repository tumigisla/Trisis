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
         switch( e.keyCode ) {
            case 38:    // up arrow
                zDist += 0.1;
                break;
            case 40:    // down arrow
                zDist -= 0.1;
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