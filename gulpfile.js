'use strict'

const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const path = require('path')
const fs = require('fs')
const packageData = require('./package.json')
const mustach = require('gulp-mustache')
const browserSync = require('browser-sync').create()

// Utils

async function stringifyStream(stream) {
  return new Promise((resolve, reject) => {
    let str = ''
    stream
      .on('data', data => {
        str += data.contents.toString()
      })
      .on('end', () => {
        resolve(str)
      })
      .on('error', error => {
        reject(error)
      })
  })
}

// Styles

async function stringifyProdStyles() {
  return await stringifyStream(
    src('./src/styles.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
  )
}

async function buildDevStyles() {
  await src('./src/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('./dev-demo/build'))
}

// Scripts

const webpackSharedOptions = {
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
}

const webpackProdOptions = {
  ...webpackSharedOptions,
  mode: 'production',
  output: {
    filename: 'bundle.js',
    library: 'bundle',
  },
}

const webpackDevOptions = {
  ...webpackSharedOptions,
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dev-demo/build'),
    filename: 'bundle.js',
    library: 'bundle',
  },
  devtool: 'source-map',
}

const webpackDevUtilsOptions = {
  ...webpackSharedOptions,
  mode: 'development',
  entry: './dev-utils/index.js',
  output: {
    path: path.resolve(__dirname, './dev-demo/build'),
    filename: 'utils.js',
    library: 'utils',
  },
  devtool: 'source-map',
}

async function stringifyProdScripts() {
  return await stringifyStream(
    src('./src/index.js').pipe(webpackStream(webpackProdOptions, webpack))
  )
}

async function buildDevScripts() {
  return new Promise((resolve, reject) => {
    webpack([webpackDevOptions, webpackDevUtilsOptions], (err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(stats.toString())
      resolve()
    })
  })
}

// Toolset XML

async function buildToolsetXml() {
  const css = await stringifyProdStyles()
  const js = await stringifyProdScripts()
  const html = fs.readFileSync('./src/loop.html', 'utf8')
  const { name, version, homepage, author, license } = packageData
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
    .pipe(dest('./dist'))
}

// Development demo

async function copyDevPeerDependencies() {
  await src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
  ]).pipe(dest('./dev-demo/build'))
}

async function serve() {
  await browserSync.init({
    server: {
      baseDir: './dev-demo',
    },
  })
}

async function reload() {
  await browserSync.reload()
}

function watchDevStyles() {
  watch('./src/**/*.scss', series(buildDevStyles, reload))
}

function watchDevScripts() {
  watch(
    ['./src/**/*.js', './dev-utils/**/*.js'],
    series(buildDevScripts, reload)
  )
}

function watchDevDemo() {
  watch('./dev-demo/*.*', reload)
}

exports.build = buildToolsetXml
exports.buildDemo = parallel(buildDevStyles, buildDevScripts, copyDevPeerDependencies)
exports.dev = series(
  parallel(buildDevStyles, buildDevScripts, copyDevPeerDependencies),
  serve,
  parallel(watchDevStyles, watchDevScripts, watchDevDemo)
)
