/**
 * Created by Li Luo on 03/23/2017.
 */

var gulp = require('gulp');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon'); // execute command like 'node server.js' in this case
var browserSync = require('browser-sync').create();

var runSequence = require('run-sequence');
var rename = require("gulp-rename");


// ===============================================================================================================
// ===============================================================================================================
// Task Starts ===================================================================================================


// ===============================================================================================================
// daily ======================================================================================================
gulp.task('default', ["serve-dev"], function(){

});


//will refresh express when code changes
gulp.task('serve-dev',['build-dev'], function (cb) {
    var started = false;

    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
    // note: use ignore **/* to disable nodemon watch function, this will allow browser-sync do proxy without break.
});
// default ends ===================================================================================================


// ===============================================================================================================
// Global Tasks ==================================================================================================

gulp.task('==== Global Tasks ====', function(){
    return gulp;
});

gulp.task('_copy_index', function(){
    return gulp.src("./index.html")
        .pipe(gulp.dest("./app"));
});
// Global Tasks ends ==============================================================================================



// ===============================================================================================================
// Development Express server ==========================================================================================

gulp.task('==== Development ExpressJS ====', function(){
    return gulp;
});


gulp.task('build-dev', ["_copy_index"], function(){
    return gulp;
});

// Local Express server ends =====================================================================================
