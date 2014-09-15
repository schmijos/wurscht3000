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

// Add a coloured div to the view
function addQuad(rgb, to) {
    document.getElementById(to).innerHTML += 
        '<div class="quad" style="background-color: '
        +'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+');"/>';
}


// DOM READY - GUI Tests:
(function(){
var tId = setInterval(function(){if(document.readyState == "complete") onComplete()},11);
function onComplete(){ clearInterval(tId);

var black = [0,   0,   0  ];
var white = [255, 255, 255];

var basePalette = generateBasePalette();
basePalette.forEach(function(el) {
         addQuad(el, "palette");
});

// get nearest
var c1 = [150,120,40];
addQuad(c1, "tries");
var n1 = findNearestColor(c1, basePalette);
addQuad(n1, "tries");
addQuad(white, "tries");

// get nearest
var c2 = [10,45,130];
addQuad(c2, "tries");
var n2 = findNearestColor(c2, basePalette);
addQuad(n2, "tries");
addQuad(white, "tries");

// get nearest
var c3 = [10,225,13];
addQuad(c3, "tries");
var n3 = findNearestColor(c3, basePalette);
addQuad(n3, "tries");
addQuad(white, "tries");

// HAM7 Simulation Red
var sourceRed = [], sourceGreen = [], sourceBlue = [];
for (var i=0; i<32; i++) {
     var v = i*8;
     sourceRed[v] = [
         Math.floor(Math.random()*256),
         Math.floor(Math.random()*256),
         Math.floor(Math.random()*256)
     ]   // random colors
     sourceGreen[v] = [ 50,  v,128]; // some shades
     sourceBlue[v]  = [128, 85,  v];  // some shades
}

sourceRed.forEach(function(c){
         addQuad(c, "fluid-test-source");
});
sourceGreen.forEach(function(c){
        addQuad(c, "fluid-test-source");
});
 sourceBlue.forEach(function(c){
         addQuad(c, "fluid-test-source");
         });

 // try to show each source color adequately
 convertManyToHam(sourceRed, basePalette).forEach(function(c){
         addQuad(c, "fluid-test-result");
         });
 convertManyToHam(sourceGreen, basePalette).forEach(function(c){
         addQuad(c, "fluid-test-result");
         });
 convertManyToHam(sourceBlue, basePalette).forEach(function(c){
         addQuad(c, "fluid-test-result");
         });

 // Image sample
 function imageLoaded(ev) {
     element = document.getElementById("cancan");
     c = element.getContext("2d");

     im = ev.target; // the image, assumed to be 200x200

     // read the width and height of the canvas
     width = element.width;
     height = element.height;

     // stamp the image on the left of the canvas:
     c.drawImage(im, 0, 0);

     // get all canvas pixel data
     imageData = c.getImageData(0, 0, width, height);

     w2 = width / 2;

     // run through the image, increasing blue, but filtering
     // down red and green:

     for (y = 0; y < height; y++) {
         inpos = y * width * 4; // *4 for 4 ints per pixel
         outpos = inpos + w2 * 4

             var previousHamColor = [128, 128, 128]; // init with cube center
         var hamColor = [0,0,0], sourceColor = [0,0,0];
         for (x = 0; x < w2; x++) {
             sourceColor[0] = imageData.data[inpos++]; // R
             sourceColor[1] = imageData.data[inpos++]; // G
             sourceColor[2] = imageData.data[inpos++]; // B
             a = imageData.data[inpos++]; // Preserver alpha channel

             hamColor = convertToHam(sourceColor, previousHamColor, basePalette)
                 previousHamColor = hamColor;

             imageData.data[outpos++] = hamColor[0];
             imageData.data[outpos++] = hamColor[1];
             imageData.data[outpos++] = hamColor[2];
             imageData.data[outpos++] = a;
         }
     }

     // put pixel data on canvas
     c.putImageData(imageData, 0, 0);
 }

 im = new Image();
 im.onload = imageLoaded;
 im.src = "http://3.bp.blogspot.com/_GaHhpQPELjg/TU5fUPkNmSI/AAAAAAAAAJE/HZARmDE0oPs/s1600/A_grass_landscape_by_sjoerdkoala.jpg";    

 };
})()

