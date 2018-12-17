/**
 * 
 */
var gulp = require('gulp');
var include = require('gulp-html-tag-include');
var preprocess = require('gulp-preprocess');
var concat = require('gulp-concat');

gulp.task('readonly-lib', function(cb) {
    var err = gulp.src([
        './js/jquery.js',
        './js/jquery.dataTables.js',
        './js/bootstrap.js',
        './js/bootstrap-submenu.js',
        './js/bootbox.js',
        './js/jquery.csv-0.71.js',
        './js/filesaver.js',
        './js/parseuri.js',
        './js/sprintf.js',
        './js/html-docx.js',
        './js/jszip.js',
        './js/xlsx_array.js',
        './js/teiconverttools.js',
        './js/teidocx.js',
        './js/teiexportxlsx.js',
        './js/rangy-core.js',
    ])
    .pipe(concat('readonly-lib.js'))
    .pipe(gulp.dest('./dist/'));
    // console.log("readonly-lib: ", err);
    cb(0); // if err is not null and not undefined, the run will stop, and note that it failed
});

gulp.task('readonly-src', function(cb) {
    var err = gulp.src([
        './editor/messgs.js',
        './editor/version.js',
        './editor/codefn.js',
        './editor/data.js',
        './editor/params.js',
        './editor/editor.js',
        './editor/utils.js',
        './editor/media.js',
        './editor/fsio.js',
        './editor/local.js',
        './editor/templates.js',
        './editor/dataload.js',
        './editor/transcription.js',
        './editor/events.js',
        './editor/tablekeyboard.js',
        './editor/drawmovezoom.js',
        './editor/sliders.js',
        './editor/partition.js',
        './editor/progress.js',
        './editor/logs.js',
        './editor/help.js',
        './editor/undo.js',
        './editor/init.js'
    ])
    .pipe(concat('readonly-src.js'))
    .pipe(gulp.dest('./dist/'));
    cb(0); // if err is not null and not undefined, the run will stop, and note that it failed
});

/*
gulp.task('readonly-css', function(cb) {
    var err = gulp.src([
        './style/jquery.dataTables.css',
        './style/bootstrap.css',
        './style/utils.css" ',
        './style/bootstrap-submenu.css',
        './style/font-awesome.css',
        './style/global.css',
    ])
    .pipe(concat('readonly-css.css'))
    .pipe(gulp.dest('./dist/'));
    cb(0); // if err is not null and not undefined, the run will stop, and note that it failed
});
//	<link rel="stylesheet" type="text/css" href="dist/readonly-css.css"></link>
*/

gulp.task('trjsread', gulp.series('readonly-lib', 'readonly-src', function () {
   // construct trsjread.html
    return gulp.src('./html/trjsread.html')
        .pipe(include())
        .pipe(preprocess({context: { VERSION: 'readonly'}}))
        .pipe(gulp.dest('.'));
}));

gulp.task('trjslocal', function () {
   // construct trjslocal.html
    return gulp.src('./html/trjslocal.html')
        .pipe(include())
        .pipe(preprocess({context: { VERSION: 'local'}}))
        .pipe(gulp.dest('.'));
});

gulp.task('trjsclient', function () {
   // construct trjsdistant.html
    return gulp.src('./html/trjsclient.html')
        .pipe(include())
        .pipe(preprocess({context: { VERSION: 'client'}}))
        .pipe(gulp.dest('.'));
});

gulp.task('electron', function () {
    // construct index.html
    return gulp.src('./html/index.html')
        .pipe(include())
        .pipe(preprocess({context: { VERSION: 'electron'}}))
        .pipe(gulp.dest('.'));
});

gulp.task('doc', function () {
    // construct doc/index.html
    return gulp.src('./doc/src/trjs_doc.html')
        .pipe(include())
        .pipe(preprocess({context: { VERSION: 'electron'}}))
        .pipe(gulp.dest('./doc'));
});

gulp.task('package', function () {
    // copy package.json dans tools
    return gulp.src('./package.json')
        .pipe(gulp.dest('tools'));
});

gulp.task('default', gulp.series('doc', 'trjslocal', 'trjsclient', 'electron', 'package'));
