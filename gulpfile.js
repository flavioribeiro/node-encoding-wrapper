var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var mocha = require('gulp-mocha');

gulp.task('help', taskListing);
gulp.task('default',['test']);
gulp.task('test', function (cb) {
  gulp.src(['src/**/*.js'])
    .on('finish', function () {
      gulp.src(['tests/*.js'])
        .pipe(mocha())
        .on('end', cb);
    });
});
