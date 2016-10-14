const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
var plato = require('plato');

gulp.task('clean', function(){
  return del(['build'])
});

gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tscConfig.filesGlob)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'/*, { sourceRoot: '.' }*/))
    .pipe(gulp.dest('build'));
});

gulp.task('typings', function () {
    return gulp.src(['./src/typings/**/*.d.ts']).pipe(gulp.dest('./dist/typings'));
});

gulp.task('compile-w', function(){
  return gulp.watch(tscConfig.filesGlob, ['compile'])
});

gulp.task('tslint', function() {
  return gulp.src(['src/**/*.ts', 'test/**/*.ts'])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report());
});

gulp.task('tslint-w', function(){
  return gulp.watch(tscConfig.filesGlob, ['tslint'])
});

gulp.task('plato', ['compile'], function () {
    var options = {
        jshint: {
            options: {
                strict: false
            }
        },
        complexity: {
            trycatch: true
        }
    };

    var cb = function(report) { };

    return plato.inspect('build/**/*.js', 'report', options, cb);
});
