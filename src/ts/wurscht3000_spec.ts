/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="wurscht3000.ts"/>

//var square_lib = require('./wurscht3000.js');

describe("#generateBasePalette", function () {
  it("returns a 2D array", function () {
    var basePalette = generateBasePalette();
    expect(basePalette).toEqual(jasmine.any(Array));
    expect(basePalette[0]).toEqual(jasmine.any(Array));
  });
});
