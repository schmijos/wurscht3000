/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="wurscht3000.ts"/>

describe("#generateBasePalette", function () {
  it("returns a 2D array", function () {
    var basePalette = generateBasePalette();
    expect(basePalette).toEqual(jasmine.any(Array));
    expect(basePalette[0]).toEqual(jasmine.any(Array));
  });
});

describe("#calcNewDiffFrame", function () {
  it("calls the calc function for each pixel", function () {
    var calcBestDiffIndex = jasmine.createSpy();

    var diffFrame: number[] = [
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0]; // 4x4 picture
    var prevEncodedFrame: [];
    var nextSourceFrame: [];
    var basePalette = [];

    //calcNewDiffFrame(diffFrame, prevEncodedFrame, nextSourceFrame, basePalette);

    //expect(calcBestDiffIndex.callCount).toBe(diffFrame.length);
  });
});
