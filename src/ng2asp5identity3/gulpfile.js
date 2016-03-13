var gulp = require('gulp');
var rimraf = require('rimraf');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var watch = require('gulp-watch');

var paths = {
    webroot: './wwwroot',
    npm: './node_modules'
};

paths.libsOutput = paths.webroot + '/lib/';
paths.tsDef = paths.webroot + "/definitions/";

paths.rxjsSource = paths.npm + '/rxjs/**/*';
paths.rxjsOutput = paths.libsOutput + '/rxjs/';
paths.sematicSource = paths.npm + '/semantic-ui/dist/**/*';
paths.sematicOutput = paths.libsOutput + '/semantic-ui/dist/';
paths.ngsematicSource = paths.npm + '/ng-semantic/**/*';
paths.ngsematicOutput = paths.libsOutput + '/ng-semantic/';

paths.tsSource = paths.webroot + '/app/**/*.ts';
paths.appOutput = paths.webroot + '/app/';
paths.jsOutput = paths.webroot + '/app/**/*.js';
paths.mapOutput = paths.webroot + '/app/**/*.map';

var tsProject = ts.createProject(paths.webroot + '/tsconfig.json');

gulp.task('remove:libs', function (cb) {
    return rimraf(paths.libsOutput + '/*', cb);
});

gulp.task('copy:libs', ['remove:libs'], function () {

    var javascript = gulp.src([
                paths.npm + '/angular2/bundles/angular2-polyfills.js',
                paths.npm + '/angular2/bundles/angular2.dev.js',
                paths.npm + '/angular2/bundles/router.dev.js',
                paths.npm + '/angular2/bundles/http.dev.js',
                paths.npm + '/systemjs/dist/system.js',
                paths.npm + '/systemjs/dist/system-polyfills.js',
                paths.npm + '/rxjs/bundles/rx.min.js',
                paths.npm + '/es6-shim/es6-shim.min.js',
                paths.npm + '/jquery/dist/jquery.min.js',
                paths.npm + '/font-awesome/css/font-awesome.min.css',
                paths.npm + '/ng-semantic/semantic.js'
    ])
        .pipe(gulp.dest(paths.libsOutput));

    var rxjs = gulp.src([paths.rxjsSource])
        .pipe(gulp.dest(paths.rxjsOutput));

    var semantic = gulp.src([paths.sematicSource])
            .pipe(gulp.dest(paths.sematicOutput));

    var ngsemantic = gulp.src([paths.ngsematicSource])
        .pipe(gulp.dest(paths.ngsematicOutput));


    return merge(javascript, rxjs, semantic, ngsemantic);

});

gulp.task('clean:js', function () {
    var jsClean = gulp.src([paths.jsOutput])
        .pipe(clean(), { force: true });

    return jsClean;
});

gulp.task('clean:map', function () {
    var mapClean = gulp.src([paths.mapOutput])
        .pipe(clean(), { force: true });

    return mapClean;
});

gulp.task('clean', ['clean:js', 'clean:map']);

gulp.task('lint:ts', function () {
    var tsLint = gulp.src(paths.tsSource)
      .pipe(tslint())
      .pipe(tslint.report('verbose'));

    return tsLint;
});

gulp.task('compile:ts', function () {
    var tsResult = gulp.src([paths.tsSource])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.appOutput));

    return tsResult;
});

gulp.task('build:all', ['clean', 'lint:ts', 'compile:ts']);

gulp.task('watch', ['build:all'], function () {
    watch([paths.tsSource], function () {
        gulp.start('build:all');
    });
});