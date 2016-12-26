const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const merge = require('merge2');
const dts = require("dts-bundle");
const plato = require('plato');
const runSequence = require('run-sequence');
const Builder = require('systemjs-builder');
const babel = require('gulp-babel');
const webpack = require('gulp-webpack');
const path = require('path');


/**
 * Clean up tasks
 */
gulp.task('clean', function (done) {
    runSequence('clean-build', 'clean-dist', done);
});
gulp.task('clean-build', function () {
    del(['./build']);
});
gulp.task('clean-dist', function () {
    del(['./dist']);
});


/**
 * Compilation
 */
gulp.task('compile', ['clean-build'], function () {

    // Get config and create project
    let tsConfig = require('./tsconfig.json');
    let tsProject = ts.createProject('./tsconfig.json');
    let outDir = tsConfig.compilerOptions.outDir;

    // Compile
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    // Output files
    return merge([
        tsResult.dts
            .pipe(gulp.dest(outDir)),
        tsResult.js
            .pipe(sourcemaps.write('.', {sourceRoot: '.'}))
            .pipe(gulp.dest(outDir))
    ]);
});


/**
 * Bundling
 */
gulp.task('bundle', ['clean-dist', 'compile'], function (done) {
    runSequence('bundle-babel', 'bundle-dts', done);
});

gulp.task('bundle-babel', function () {
    // Using .babelrc transform all
    gulp.src('./build/src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('bundle-dts', function () {
    // Copy all .d.ts from /build/src to /dist
    return gulp
        .src(['./build/src/**/*.d.ts'])
        .pipe(gulp.dest('./dist'));
});


/**
 * Linting
 */

gulp.task('lint', function (done) {
    runSequence('lint-ts', done);
});

gulp.task('lint-ts', function () {
    return gulp.src(tscConfig.filesGlob)
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});


/**
 * Others
 */

gulp.task('plato', ['compile'], function () {
    const options = {
        jshint: {
            options: {
                strict: false
            }
        },
        complexity: {
            trycatch: true
        }
    };

    const cb = function (report) {
    };

    return plato.inspect('build/**/*.js', 'report', options, cb);
});


/**
 * Scripts
 */

gulp.task('build', function (done) {
    runSequence('bundle', done);
});

gulp.task('default', ['build'], function () {
});
