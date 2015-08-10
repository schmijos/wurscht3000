"use strict";

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

// Test JS
gulp.task('specs', function () {
	return gulp.src('src/js/**/*_spec.js')
					     .pipe(jasmine());
});

// Default Task
gulp.task('default', function() {
		// place code for your default task here
});

gulp.task('default', ['specs']);
