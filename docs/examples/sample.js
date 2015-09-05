// DOM READY - Encode and Decode Test Still Frame:
(function () {
  var basePalette = generateBasePalette();

  // Image sample
  function onVideoPlay(ev) {
    alert("Begin dec/enc now.");

    var $this = this;

    var imgWidth = ev.target.videoWidth;
    var imgHeight = ev.target.videoHeight;

    // init source
    var sourceCanvas = document.getElementById("sourceImageContainer");
    sourceCanvas.width = imgWidth;
    sourceCanvas.height = imgHeight;
    var sourceCtx = sourceCanvas.getContext("2d");
    sourceCtx.drawImage(ev.target, 0, 0);

    // init target
    var targetCanvas = document.getElementById("targetImageContainer");
    targetCanvas.width = imgWidth;
    targetCanvas.height = imgHeight;
    var targetCtx = targetCanvas.getContext("2d");

    // init a still frame setup
    var currentDiffFrame = new Array(imgWidth * imgHeight);
    for (var i = 0; i < currentDiffFrame.length; i++) {
      currentDiffFrame[i] = 0;
    }

    var currentRenderFrame = new Array(4 * imgWidth * imgHeight);
    for (var i = 0; i < currentRenderFrame.length; i++) {
      currentRenderFrame[i] = 255; // begin with all white
    }

    var sourceFrame = sourceCtx.getImageData(0, 0, imgWidth, imgHeight).data;
    var frame = 0;

    // main loop: rendering a encoding and decoding a source frame
    setInterval(function () {
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

})();

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function () {
  // Grab elements, create settings, etc.
  var video = document.getElementById("sourceVideo"),
    videoObj = {"video": true},
    errBack = function (error) {
      console.log("Video capture error: ", error.code);
    };

  // Put video listeners into place
  if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function (stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function (stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if (navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function (stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
}, false);

