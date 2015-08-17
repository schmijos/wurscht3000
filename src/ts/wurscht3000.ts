module Wurscht3000 {
  // Generates a base palette for cyclic additive HAM7
  export function generateBasePalette(): number[][] {
      /*// empirical best for 2bits per pixel
      return [
          [ 31, 17, 13],
          [ 13, 31, 17],
          [ 17, 13, 31],
          [240,240,240],
      ];*/

      /*return [
          [  8,250,  8],
          [250,  8,250],
      ];*/

      return [
          [ 31, 17, 13],
          [ 13, 31, 17],
          [ 17, 13, 31],
          [240,240,240],
          [ 59, 37, 23],
          [ 23, 59, 37],
          [ 37, 23, 59],
          [225,225,225]
      ];
      // one for 3bits per pixel
      /*return [
          [  8,  0,  0],
          [  0,  8,  0],
          [  0,  0,  8],
          [  0,  0,239],
          [  0,239,  0],
          [239,  0,  0],
          [127,127,127],
          [200,200,200]
      ];*/

  }

  // Calculate the nearest distance from the previously shown pixel to the next one
  export function calcBestDiffIndex(prevEncodedFrame: number[], nextSourceFrame: number[], pixelOffset: number, basePalette: number[][]): number {
      var resultingMinIndex: number;
      var minDistance: number = 9999;

      // calculate distance between previously encoded frame and the next one to be encoded
      var prevR: number = prevEncodedFrame[pixelOffset];
      var prevG: number = prevEncodedFrame[pixelOffset+1];
      var prevB: number = prevEncodedFrame[pixelOffset+2];

      var nextR: number = nextSourceFrame[pixelOffset];
      var nextG: number = nextSourceFrame[pixelOffset+1];
      var nextB: number = nextSourceFrame[pixelOffset+2];

      // now choose the best base color vector
      for (var i = 0; i < basePalette.length; i++) {
          // calculate distance between diff and base palette
          var dist: number = Math.pow(
              Math.pow( (prevR + basePalette[i][0]) % 256 - nextR, 2) +
              Math.pow( (prevG + basePalette[i][1]) % 256 - nextG, 2) +
              Math.pow( (prevB + basePalette[i][2]) % 256 - nextB, 2)
          , 0.5); // Euclidian Distance

          // keep the smallest distance
          if (dist < minDistance) {
              minDistance = dist;
              resultingMinIndex = i;
          }
      }

      return resultingMinIndex;
  }

  // Calculate the jump diff to reach the next frame
  export function calcNewDiffFrame(resDiffFrame: number[], prevEncodedFrame: number[], nextSourceFrame: number[], basePalette: number[][]): void {
      for (var i = 0; i < resDiffFrame.length; i++) {
          resDiffFrame[i] = calcBestDiffIndex(prevEncodedFrame, nextSourceFrame, 4*i, basePalette);
      }
  }

  // Render pixel by pixel on a canvas context
  export function renderFrame(ctx: CanvasRenderingContext2D, diff: number[], width: number, height: number, basePalette: number[][]): void {
      var imageData: ImageData = ctx.getImageData(0, 0, width, height);
      var diffPos: number = 0;
      for (var i = 0; i < imageData.data.length; diffPos++) {
          var diffColor: number[] = basePalette[diff[diffPos]];
          imageData.data[i] = (imageData.data[i++] + diffColor[0]) % 256; // Red
          imageData.data[i] = (imageData.data[i++] + diffColor[1]) % 256; // Green
          imageData.data[i] = (imageData.data[i++] + diffColor[2]) % 256; // Blue
          imageData.data[i++] = 255; // Alpha
      }
      ctx.putImageData(imageData, 0, 0);
  }
}



/*

// DOM READY - Encode and Decode Test Still Frame:
(function(){
    var basePalette = generateBasePalette();

    // Image sample
    function onVideoPlay(ev) {
        alert("Begin dec/enc now.");

        var $this = this;

        var imgWidth = ev.target.videoWidth;
        var imgHeight = ev.target.videoHeight;

        // init source
        var sourceCanvas: any = document.getElementById("sourceImageContainer");
        sourceCanvas.width = imgWidth;
        sourceCanvas.height = imgHeight;
        var sourceCtx = sourceCanvas.getContext("2d");
        sourceCtx.drawImage(ev.target, 0, 0);

        // init target
        var targetCanvas: any = document.getElementById("targetImageContainer");
        targetCanvas.width = imgWidth;
        targetCanvas.height = imgHeight;
        var targetCtx = targetCanvas.getContext("2d");

        // init a still frame setup
        var currentDiffFrame = new Array(imgWidth * imgHeight);
        for(var i = 0; i < currentDiffFrame.length; i++) {
            currentDiffFrame[i] = 0;
        }

        var currentRenderFrame = new Array(4 * imgWidth * imgHeight);
        for(var i = 0; i < currentRenderFrame.length; i++) {
            currentRenderFrame[i] = 255; // begin with all white
        }

        var sourceFrame = sourceCtx.getImageData(0, 0, imgWidth, imgHeight).data;
        var frame = 0;

        // main loop: rendering a encoding and decoding a source frame
        setInterval(function() {
            sourceCtx.drawImage(ev.target, 0, 0);
            sourceFrame = sourceCtx.getImageData(0, 0, imgWidth, imgHeight).data;

            document.getElementById("frameCounter").innerHTML = ++frame;

            calcNewDiffFrame(currentDiffFrame, currentRenderFrame, sourceFrame, basePalette);
            renderFrame(targetCtx, currentDiffFrame, imgWidth, imgHeight, basePalette);
            currentRenderFrame = targetCtx.getImageData(0, 0, imgWidth, imgHeight).data;
        }, 40);
    }

    // init
    var video = document.getElementById('sourceVideo');
    video.addEventListener('play', onVideoPlay, false);

})()

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
    // Grab elements, create settings, etc.
    var video = document.getElementById("sourceVideo"),
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code);
        };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
}, false);

*/
