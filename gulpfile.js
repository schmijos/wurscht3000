"use strict";

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var ts = require('gulp-typescript');

gulp.task('ts_test', function () {
	var tsProject = ts.createProject('tsconfig.json', {
			noImplicitAny: true,
			out: 'test.js'
		});
  var tsResult = gulp.src('src/**/*.ts').pipe(ts(tsProject)); // also include spec files
  return tsResult.js.pipe(gulp.dest('built/local'));
});

gulp.task('ts', function () {
	var tsProject = ts.createProject('tsconfig.json', {
			noImplicitAny: true,
			out: 'dist.js'
		});
  var tsResult = tsProject.src().pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('built/local'));
});

// Test JS
gulp.task('test', ['ts_test'], function () {
	return gulp.src('built/local/test.js')
					     .pipe(jasmine());
});

gulp.task('default', ['test']);
gulp.task('build', ['ts']);
