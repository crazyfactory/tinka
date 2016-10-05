const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
var plato = require('gulp-plato');

gulp.task('clean', function(){
  return del('build')
});

gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tscConfig.filesGlob)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('compile-w', function(){
  return gulp.watch(tscConfig.filesGlob, ['compile'])
});

gulp.task('tslint', function() {
  return gulp.src('src/httpClient.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('tslint-w', function(){
  return gulp.watch(tscConfig.filesGlob, ['tslint'])
});

gulp.task('plato', ['compile'], function () {
    return gulp.src('build/**/*.js')
        .pipe(plato('report', {
            jshint: {
                options: {
                    strict: false
                }
            },
            complexity: {
                trycatch: true
            }
        }));
});
