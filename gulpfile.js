'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const { rollup } = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
// const mustach = require('gulp-mustache');
const browserSync = require('browser-sync').create();
// const config = require('./src/config');

async function buildStyles() {
  await src('./src/style.scss')
    .pipe(sass())
    .pipe(dest('./tmp'));
}

async function stringifyStyles() {
  return new Promise((resolve, reject) => {
    let str = '';
    src('./src/style.scss')
      .pipe(sass())
      .on('data', (data) => {
        str += data.contents.toString();
      })
      .on('end', () => {
        resolve(str);
      })
      .on('error', error => {
        reject(error);
      });
  });
}

const rollupConfig = {
  input: './src/script.js',
  plugins: [
    nodeResolve(),
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      exclude: 'node_modules/**',
    }),
  ],
  external: ['jquery', 'bootstrap'],
};

async function buildScripts() {
  const bundle = await rollup(rollupConfig);
  await bundle.write({
    file: './tmp/script.js',
    format: 'iife',
    name: 'script',
    globals: { jquery: '$' },
  });
}

async function readFile(path, opts = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function buildToolsetImport() {
  const css = await stringifyStyles();
  console.log('CSS:', css);
}

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

function watchStyles() {
  watch('./src/**/*.scss', series(buildStyles, reload));
}

function watchScripts() {
  watch('./src/**/*.js', series(buildScripts, reload));
}

function watchDevDemo() {
  watch('./dev-demo/*.*', reload);
}

exports.build = series(buildToolsetImport);
exports.dev = series(
  parallel(buildStyles, buildScripts),
  serve,
  parallel(watchStyles, watchScripts, watchDevDemo)
);
