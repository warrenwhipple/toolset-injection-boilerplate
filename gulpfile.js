'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const browserSync = require('browser-sync').create();

async function serve() {
  await browserSync.init({
    server: {
      baseDir: './dev-demo',
      routes: {
        '/jquery': './node_modules/jquery/dist',
        '/bootstrap': './node_modules/bootstrap/dist',
        '/build': './tmp',
      },
    },
  });
}

async function reload() {
  await browserSync.reload();
}

async function devBuildStyles() {
  await src('./src/style.scss')
    .pipe(sass())
    .pipe(dest('./tmp'));
}

async function devBuildScripts() {
  const bundle = await rollup.rollup({
    input: './src/script.js',
    plugins: [
      resolve(),
      babel({
        babelrc: false,
        presets: [['@babel/env', { modules: false }]],
        exclude: 'node_modules/**',
      }),
    ],
    external: ['jquery', 'bootstrap'],
  });
  await bundle.write({
    file: './tmp/script.js',
    format: 'iife',
    name: 'script',
    globals: { jquery: '$' },
  });
}

function watchStyles() {
  watch('./src/**/*.scss', series(devBuildStyles, reload));
}

function watchScripts() {
  watch('./src/**/*.js', series(devBuildScripts, reload));
}

function watchDevDemo() {
  watch('./dev-demo/*.*', reload);
}

exports.dev = series(
  parallel(devBuildStyles, devBuildScripts),
  serve,
  parallel(watchStyles, watchScripts, watchDevDemo)
);
