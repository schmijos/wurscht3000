// Generates a base palette for cyclic additive HAM7
function generateBasePalette() {
    return [
        [ 31, 17, 13],
        [ 13, 31, 17],
        [ 17, 13, 31],
        [240,240,240],
    ];
}

// Calculate the nearest distance from the previously shown pixel to the next one
function calcBestDiffIndex(prevEncodedColor, nextSourceColor, basePalette) {
    var r,g,b; minDistance, minIndex;

    // calculate distance between previously encoded frame and the next one to be encoded
    r = (nextSourceColor[0] - prevEncodedColor[0]) % 256;
    g = (nextSourceColor[1] - prevEncodedColor[1]) % 256;
    b = (nextSourceColor[2] - prevEncodedColor[2]) % 256;
        
    for (i = 0; i < basePalette.length; i++) {
        // calculate distance between diff and base palette
        var dist = Math.pow(
            Math.pow(basePalette[0] - r, 2) + 
            Math.pow(basePalette[1] - g, 2) +
            Math.pow(basePalette[2] - b, 2)
        , 0.5); // Euclidian Distance

        // keep the smallest distance
        if (dist < minDistance) {
            minDistance = dist;
            minIndex = i;
        }        
    }
    
    return minIndex;
}

// Calculate the jump diff to reach the next frame
function calcNewDiffFrame(prevEncodedFrame, nextSourceFrame, basePalette) {
    var diff = new Array(prevEncodedFrame.length);
    for (i = 0; i < prevEncodedFrame.length; i++) {
        diff[i] = calcBestDiffIndex(prevEncodedFrame[i], prevSourceColor[i], basePalette);
    }
    return diff;
}

// Render pixel by pixel on a canvas context
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

// DOM READY - GUI Tests:
(function(){

    var black = [0,   0,   0  ];
    var white = [255, 255, 255];
    var basePalette = generateBasePalette();

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

