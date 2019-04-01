'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const { rollup } = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const fs = require('fs');
const viewConfig = require('./src/view-config.json');
const mustach = require('gulp-mustache');
const browserSync = require('browser-sync').create();

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
      .on('data', data => {
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

const rollupDevConfig = {
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

const rollupProdConfig = {
  ...rollupDevConfig,
  plugins: [...rollupDevConfig.plugins, terser()],
};

const rollupWriteConfig = {
  file: './tmp/script.js',
  format: 'iife',
  name: 'script',
  globals: { jquery: '$' },
};

async function buildScripts() {
  const bundle = await rollup(rollupDevConfig);
  await bundle.write(rollupWriteConfig);
}

async function stringifyScripts() {
  const bundle = await rollup(rollupProdConfig);
  await bundle.write(rollupWriteConfig);
  return fs.readFileSync(rollupWriteConfig.file, 'utf8');
}

async function buildToolsetImport() {
  const css = await stringifyStyles();
  const js = await stringifyScripts();
  const html = fs.readFileSync('./src/loop.html', 'utf8');
  await src('./templates/toolset-import.xml')
    .pipe(
      mustach({
        ...viewConfig,
        css,
        js,
        html,
      })
    )
    .pipe(dest('./dist'));
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
