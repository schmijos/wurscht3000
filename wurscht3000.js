// Generates a base palette for cyclic additive HAM7
function generateBasePalette() {
    var arr = [];

    var r,g,b;
    for(var i=0; i<1; i++) {
        arr[arr.length] = [31,17,13];
        arr[arr.length] = [13,31,17];
        arr[arr.length] = [17,13,31];
        arr[arr.length] = [240,240,240];
    }

    return arr;
}

// Find nearest color by euclidian distance
function findNearestColor(referenceColor, someColors) {
    var rWeight = 1, // we could prefer specific color parts
        gWeight = 1,
        bWeight = 1,
        minDist = Infinity,
        foundColor;
    someColors.forEach(function(q){
            var dist = Math.pow(
                    rWeight * Math.pow(referenceColor[0] - q[0], 2) 
                    + gWeight * Math.pow(referenceColor[1] - q[1], 2)
                    + bWeight * Math.pow(referenceColor[2] - q[2], 2)
                    , 0.5); // Euclidian Distance
            if (dist < minDist) {
                minDist = dist;
                foundColor = q;
            }
    });
    return foundColor;
}

// Calculate all valid next HAM7 colors (by jump with addition)
function calculateJumpCandidates(basePalette, previousColor) {
    var result = [];
    var r,g,b;
    basePalette.forEach(function(baseColor){
            r = (previousColor[0] + baseColor[0]) % 256;
            g = (previousColor[1] + baseColor[1]) % 256;
            b = (previousColor[2] + baseColor[2]) % 256;
            //result[result.length] = [ previousColor[0], g, b ]; // hold red
            //result[result.length] = [ r, previousColor[1], b ]; // hold green
            //result[result.length] = [ r, g, previousColor[2] ]; // hold blue
            result[result.length] = [ r,g,b];
    });
    return result;
}

// Get the HAM representation of a source color using the previous HAM color and the base palette.
function convertToHam(sourceColor, previousHamColor, basePalette) {
    var indexColor = findNearestColor(sourceColor, basePalette);
    var jumpCandidates = calculateJumpCandidates(basePalette, previousHamColor);
    //jumpCandidates[jumpCandidates.length] = indexColor; // indclude index color into calculations
    return findNearestColor(sourceColor, jumpCandidates); // return HAM Color
}

// Convert a color array to the correspondinnnng HAM representation
function convertManyToHam(sourceColors, basePalette) {
    var result = [];
    var previousHamColor = [128, 128, 128]; // init with cube center
    var hamColor;
    sourceColors.forEach(function(sourceColor){
            hamColor = convertToHam(sourceColor, previousHamColor, basePalette);
            previousHamColor = hamColor;
            result[result.length] = hamColor;
    });
    return result;
}

// DOM READY - GUI Tests:
(function(){

    var black = [0,   0,   0  ];
    var white = [255, 255, 255];
    var basePalette = generateBasePalette();

    function renderFrame(ctx, diff, width, height) {
        imageData = ctx.getImageData(0, 0, width, height);
        for (i = 0; i < imageData.data.length;) {
            imageData.data[i] = (imageData.data[i] + diff[i++]) % 256; // Red
            imageData.data[i] = (imageData.data[i] + diff[i++]) % 256; // Green
            imageData.data[i] = (imageData.data[i] + diff[i++]) % 256; // Blue
            imageData.data[i] = imageData.data[i++]; // Alpha
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Image sample
    function imageLoaded(ev) {
        var el = document.getElementById("cancan");
        var ctx = el.getContext("2d");
        ctx.drawImage(ev.target, 0, 0);

        var diff = new Array(4 * el.width * el.height);
        for(var i=0; i < diff.length; i++) {
            diff[i] = 1;
        }

        setInterval(function() {
            renderFrame(ctx, diff, el.width, el.height);
        }, 100);
    }

    im = new Image();
    im.onload = imageLoaded;
    im.src = "coredump.png"; 

})()

