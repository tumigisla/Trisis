// Translation decisions versions
var translDec = {
    ver0 :  [   [-0.4, 0, 0],   // left
                [0.4, 1, 1],    // down
                [0.4, 0, 1],    // right
                [-0.4, 1, 0]    // up
            ],
    ver1 :  [   [0.4, 1, 1],    // down
                [0.4, 0, 1],    // right
                [-0.4, 1, 0],   // up
                [-0.4, 0, 0],   // left
            ],
    ver2 :  [   [0.4, 0, 1],    // right
                [-0.4, 1, 0],   // up
                [-0.4, 0, 0],   // left
                [0.4, 1, 1]     // down
            ],
    ver3 :  [   [-0.4, 1, 0],   // up
                [-0.4, 0, 0],   // left
                [0.4, 1, 1],    // down
                [0.4, 0, 1]     // right
            ],
};

// Translation changes
var translCh = {
    ver0 :  [   [0, 0, 1],   // down arrow
                [0, 1, 0],   // right arrow
                [0, 0, -1],  // up arrow
                [0, -1, 0]  // left arrow
            ],
    ver1 :  [   [0, 1, 0],   // right arrow
                [0, 0, -1],  // up arrow
                [0, -1, 0],  // left arrow
                [0, 0, 1]   // down arrow
            ],
    ver2 :  [   [0, 0, -1],  // up arrow
                [0, -1, 0],  // left arrow
                [0, 0, 1],   // down arrow
                [0, 1, 0]   // right arrow
            ],
    ver3 :  [   [0, -1, 0],  // left arrow
                [0, 0, 1],   // down arrow
                [0, 1, 0],   // right arrow
                [0, 0, -1]  // up arrow
            ]  
};

var lShapeRots = {
    xAx : {
        cube1 : {
            0 :     [0,1],  // i+1
            90 :    [2,1],  // k+1
            180 :   [0,-1], // i-1
            270 :   [2,-1]  // k-1
        },
        cube2 : {
            0 :     [1,1],  // j+1
            90 :    [1,1],  // j+1
            180 :   [1,1],  // j+1
            270 :   [1,1]  // j+1
        }
    },
    yAx : {
        cube1 : {
            0 :     [0,1],  // i+1
            90 :    [0,1],  // i+1
            180 :   [0,1],  // i+1
            270 :   [0,1]  // i+1
        },
        cube2 : {
            0 :     [1,1],  // j+1
            90 :    [2,-1], // k-1
            180 :   [1,-1], // j-1
            270 :   [2,1]   // k+1
        }
    },
    zAx : {
        cube1 : {
            0 :     [0,1],  // i+1
            90 :    [1,-1], // j-1
            180 :   [0,-1], // i-1
            270 :   [1,1]   // j+1
        },
        cube2 : {
            0 :     [1,1],  // j+1
            90 :    [0,1],  // i+1
            180 :   [1,-1], // j-1
            270 :   [0,-1]  // i-1
        }
    }
};