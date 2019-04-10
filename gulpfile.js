'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const fs = require('fs');
const packageData = require('./package.json');
const mustach = require('gulp-mustache');
const browserSync = require('browser-sync').create();

const DEV = 'development';
const PROD = 'production';

function stylesStream(mode) {
  let stream = src('./src/styles.scss');
  if (mode === DEV) stream = stream.pipe(sourcemaps.init());
  stream = stream.pipe(sass().on('error', sass.logError)).pipe(autoprefixer());
  if (mode === DEV) stream = stream.pipe(sourcemaps.write());
  return stream;
}

function scriptsStream(mode) {
  let options = {
    mode,
    output: {
      filename: 'bundle.js',
      library: 'bundle',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    externals: {
      jquery: 'jQuery',
      bootstrap: 'bootstrap',
    },
  };
  if (mode == DEV) options.devtool = 'source-map';
  return src('./src/scripts.js').pipe(webpackStream(options, webpack));
}

function buildStyles(mode) {
  return async () => await stylesStream(mode).pipe(dest('./tmp'));
}

function buildScripts(mode) {
  return async () => await scriptsStream(mode).pipe(dest('./tmp'));
}

async function stringifyStream(stream) {
  return new Promise((resolve, reject) => {
    let str = '';
    stream
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

function buildToolsetImport(mode) {
  return async () => {
    const css = await stringifyStream(stylesStream(mode));
    const js = await stringifyStream(scriptsStream(mode));
    const html = fs.readFileSync('./src/loop.html', 'utf8');
    const { name, version, homepage, author, license } = packageData;
    await src('./templates/toolset-import.xml')
      .pipe(
        mustach({
          title: name,
          version,
          link: homepage,
          author,
          license,
          css,
          js,
          html,
        })
      )
      .pipe(dest('./dist'));
  };
}

async function serve() {
  await browserSync.init({
    server: {
      baseDir: './dev-demo',
      routes: {
        '/node_modules': './node_modules',
        '/build': './tmp',
      },
    },
  });
}

async function reload() {
  await browserSync.reload();
}

function watchStyles(mode) {
  return () => {
    watch('./src/**/*.scss', series(buildStyles(mode), reload));
  };
}

function watchScripts(mode) {
  return () => {
    watch('./src/**/*.js', series(buildScripts(mode), reload));
  };
}

function watchDevDemo() {
  watch('./dev-demo/*.*', reload);
}

exports.build = series(buildToolsetImport(PROD));
exports.dev = series(
  parallel(buildStyles(DEV), buildScripts(DEV)),
  serve,
  parallel(watchStyles(DEV), watchScripts(DEV), watchDevDemo)
);
