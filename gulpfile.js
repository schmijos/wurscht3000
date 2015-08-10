"use strict";

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var ts = require('gulp-typescript');

gulp.task('ts', function () {
	var tsProject = ts.createProject('tsconfig.json');
  var tsResult = tsProject.src()
    .pipe(ts({
        noImplicitAny: true,
        out: 'output.js'
      }));
  return tsResult.js.pipe(gulp.dest('built/local'));
});


// Test JS
gulp.task('test', function () {
	return gulp.src('built/local/**/*_spec.js')
					     .pipe(jasmine());
});

gulp.task('default', ['ts']);
