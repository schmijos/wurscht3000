// Generates a base palette for cyclic additive HAM7
function generateBasePalette() {
/*    
    return [
        [ 31, 17, 13],
        [ 13, 31, 17],
        [ 17, 13, 31],
        [240,240,240],
    ];
*/

    return [
        [ 1, 0, 0],
        [ 0, 1, 0],
        [ 0, 0, 1],
        [250,0,0],
        [0,250,0],
        [0,0,250]
    ];
}

// Calculate the nearest distance from the previously shown pixel to the next one
function calcBestDiffIndex(prevEncodedFrame, nextSourceFrame, pixelOffset, basePalette) {
    var prevR, prevG, prevB, nextR, nextG, nextB, minIndex;
    var minDistance = 9999;

    // calculate distance between previously encoded frame and the next one to be encoded
    prevR = prevEncodedFrame[pixelOffset];
    prevG = prevEncodedFrame[pixelOffset+1];
    prevB = prevEncodedFrame[pixelOffset+2];
    
    nextR = nextSourceFrame[pixelOffset]; 
    nextG = nextSourceFrame[pixelOffset+1]; 
    nextB = nextSourceFrame[pixelOffset+2]; 

    // now choose the best base color vector
    for (var i = 0; i < basePalette.length; i++) {
        // calculate distance between diff and base palette
        var dist = Math.pow(
            Math.pow( (basePalette[i][0]+prevR)%256 - nextR, 2) + 
            Math.pow( (basePalette[i][1]+prevG)%256 - nextG, 2) +
            Math.pow( (basePalette[i][2]+prevB)%256 - nextB, 2)
        , 0.5); // Euclidian Distance       

        dist = dist % 256;
        // keep the smallest distance
        if (dist < minDistance) {
            minDistance = dist;
            minIndex = i;
        }        
    }

    return minIndex;
}

// Calculate the jump diff to reach the next frame
function calcNewDiffFrame(resDiffFrame, prevEncodedFrame, nextSourceFrame, basePalette) {
    for (var i = 0; i < resDiffFrame.length; i++) {
        resDiffFrame[i] = calcBestDiffIndex(prevEncodedFrame, nextSourceFrame, i, basePalette);
    }
}

// Render pixel by pixel on a canvas context
function renderFrame(ctx, diff, width, height, basePalette) {
    imageData = ctx.getImageData(0, 0, width, height);
    diffPos = 0;
    for (var i = 0; i < imageData.data.length; diffPos++) {
        console.log(basePalette[diff[diffPos]]);
        imageData.data[i] = (imageData.data[i++] + basePalette[diff[diffPos]][0]) % 256; // Red
        imageData.data[i] = (imageData.data[i++] + basePalette[diff[diffPos]][1]) % 256; // Green
        imageData.data[i] = (imageData.data[i++] + basePalette[diff[diffPos]][2]) % 256; // Blue
        imageData.data[i] = imageData.data[i++]; // Alpha
    }
    ctx.putImageData(imageData, 0, 0);
}

/*
// One Pixel Still Frame Test
(function(){
    var basePalette = generateBasePalette();
    var currentDiffFrame = [ 0 ];
    var currentRenderFrame = [ 0,0,0,0 ];
    var stillSourceFrame = [ 0,10,10,0 ] 
    for(var i = 0; i < 1000; i++) {
        console.log("frame: "+i);
        calcNewDiffFrame(currentDiffFrame, currentRenderFrame, stillSourceFrame, basePalette)
        currentRenderFrame[0] = (currentRenderFrame[0] + basePalette[currentDiffFrame[0]][0]) % 256
        currentRenderFrame[1] = (currentRenderFrame[1] + basePalette[currentDiffFrame[0]][1]) % 256
        currentRenderFrame[2] = (currentRenderFrame[2] + basePalette[currentDiffFrame[0]][2]) % 256
        console.log(currentDiffFrame)
        console.log(currentRenderFrame)
               
    }
})()
*/

// DOM READY - Encode and Decode Test Still Frame:
(function(){

    var black = [0,   0,   0  ];
    var white = [255, 255, 255];
    var basePalette = generateBasePalette();

    // Image sample
    function imageLoaded(ev) {
        var el = document.getElementById("cancan");
        var ctx = el.getContext("2d");
        ctx.drawImage(ev.target, 0, 0);

        // render a still frame 
        var currentDiffFrame = new Array(el.width * el.height);
        for(var i = 0; i < currentDiffFrame.length; i++) {
            currentDiffFrame[i] = 0;
        }
        var currentRenderFrame = new Array(4 * el.width * el.height);
        for(var i = 0; i < currentRenderFrame.length; i++) {
            currentRenderFrame[i] = 0;
        }
        var stillSourceFrame = ctx.getImageData(0, 0, el.width, el.height).data;
        var frame = 0;
 //       setInterval(function() {
            calcNewDiffFrame(currentDiffFrame, currentRenderFrame, stillSourceFrame, basePalette);
            renderFrame(ctx, currentDiffFrame, el.width, el.height, basePalette);
            currentRenderFrame = ctx.getImageData(0, 0, el.width, el.height).data;
            console.log("frame: "+ ++frame);
   //     }, 1000);
    }

    im = new Image();
    im.onload = imageLoaded;
    im.src = "sample.png"; 

})()
