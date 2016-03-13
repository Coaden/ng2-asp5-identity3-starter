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
    npm: './node_modules',
    src: './src'
};

paths.libsOutput = paths.webroot + '/lib/';
paths.tsDef = paths.webroot + "/definitions/";

paths.rxjsSource = paths.npm + '/rxjs/**/*';
paths.rxjsOutput = paths.libsOutput + '/rxjs/';
paths.sematicSource = paths.npm + '/semantic-ui/dist/**/*';
paths.sematicOutput = paths.libsOutput + '/semantic-ui/dist/';
paths.ngsematicSource = paths.npm + '/ng-semantic/**/*';
paths.ngsematicOutput = paths.libsOutput + '/ng-semantic/';

paths.tsSource = paths.src + '/app/**/*.ts';
paths.tsOutput = paths.webroot + '/app/**/*.ts';
paths.htmlSource = paths.src + '/app/**/*.html';
paths.htmlOutput = paths.webroot + '/app/**/*.html';
paths.appOutput = paths.webroot + '/app/';
paths.jsOutput = paths.webroot + '/app/**/*.js';

var tsProject = ts.createProject(paths.src + '/tsconfig.json');

gulp.task('clean:libs', function (cb) {
    return rimraf(paths.libsOutput, cb);
});

gulp.task('copy:libs', ['clean:libs'], function () {

    var javascript = gulp.src([
                paths.npm + '/angular2/bundles/angular2-polyfills.min.js',
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

    var semantic =gulp.src([paths.sematicSource])
            .pipe(gulp.dest(paths.sematicOutput));

    var ngsemantic = gulp.src([paths.ngsematicSource])
        .pipe(gulp.dest(paths.ngsematicOutput));


    return merge(javascript, rxjs, semantic, ngsemantic);

});

gulp.task('clean:src', function() {
    var html = gulp.src([paths.htmlOutput])
        .pipe(clean(), { force: true });

    var ts = gulp.src([paths.tsOutput])
        .pipe(clean(), { force: true });

    var js = gulp.src([paths.jsOutput])
        .pipe(clean(), { fource: true });

    return merge(html, ts, js);
});


gulp.task('copy:src', ['clean:src'], function () {
    var html = gulp.src([paths.htmlSource])
        .pipe(gulp.dest(paths.appOutput));

    var ts =  gulp.src([paths.tsSource])
    .pipe(gulp.dest(paths.appOutput));

    return merge(html, ts);
});

gulp.task('ts-compile', function () {
    var tsResult = gulp.src([paths.tsSource])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.appOutput));
});

gulp.task('tslint', function () {
    return gulp.src(paths.tsSource)
      .pipe(tslint())
      .pipe(tslint.report('verbose'));
});

gulp.task('build', ['tslint', 'ts-compile', 'copy:src']);

gulp.task('watch', ['build'], function () {
    watch([paths.htmlSource, paths.tsSource], function () {
        gulp.start( 'build' );
    });
});