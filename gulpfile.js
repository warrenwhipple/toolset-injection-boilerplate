'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
// const rollup = require('rollup');

function styles(done) {
  gulp
    .src('./src/sass/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'));
  done();
}

exports.build = gulp.series(styles);
