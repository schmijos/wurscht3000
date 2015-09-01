/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="wurscht3000.ts"/>

describe("#generateBasePalette", function () {
  it("returns a 2D array", function () {
    var basePalette = Wurscht3000.generateBasePalette();
    expect(basePalette).toEqual(jasmine.any(Array));
    expect(basePalette[0]).toEqual(jasmine.any(Array));
  });
});

describe("#calcNewDiffFrame", function () {
  it("calls the calc function for each pixel", function () {
    spyOn(Wurscht3000, 'calcBestDiffIndex').and.returnValue(1);

    var diffFrame: number[] = [
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0]; // 4x4 picture
    var prevEncodedFrame: number[] = [];
    var nextSourceFrame: number[] = [];
    var basePalette: number[][] = [];

    Wurscht3000.calcNewDiffFrame(diffFrame, prevEncodedFrame, nextSourceFrame, basePalette);
    expect(Wurscht3000.calcBestDiffIndex.calls.count()).toBe(diffFrame.length);
  });
});
