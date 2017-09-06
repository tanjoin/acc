var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('main', function() {
  browserify( {
    entries: ['./src/js/main.js']
  }).bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('maker', function() {
  browserify( {
    entries: ['./src/js/maker.js']
  }).bundle()
  .pipe(source('maker.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('calendar', function() {
  browserify( {
    entries: ['./src/js/calendar.js']
  }).bundle()
  .pipe(source('calendar.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/js/main.js', ['main']);
  gulp.watch('./src/js/maker.js', ['maker']);
  gulp.watch('./src/js/calendar.js', ['calendar']);
});

gulp.task('default', ['main', 'maker', 'calendar', 'watch']);
