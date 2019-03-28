'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

async function styles() {
  await gulp
    .src('./src/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'));
}

async function scripts() {
  const bundle = await rollup.rollup({
    input: './src/script.js',
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    external: 'jquery',
  });
  await bundle.write({
    file: './dist/script.js',
    format: 'iife',
    name: 'script',
    globals: { jquery: '$' },
  });
}

exports.build = gulp.parallel(styles, scripts);
