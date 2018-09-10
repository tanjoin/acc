var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('main', function() {
  return browserify( {
    entries: ['./src/js/main.js']
  }).bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('export', () => {
  return browserify({
    entries: ['./src/js/export.js']
  }).bundle()
  .pipe(source('export.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('maker', function() {
  return browserify( {
    entries: ['./src/js/maker.js']
  }).bundle()
  .pipe(source('maker.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('calendar', function() {
  return browserify( {
    entries: ['./src/js/calendar.js']
  }).bundle()
  .pipe(source('calendar.js'))
  .pipe(buffer())
  .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/js/main.js',  gulp.series('main'));
  gulp.watch('./src/js/maker.js',  gulp.series('maker'));
  gulp.watch('./src/js/export.js',  gulp.series('export'));
  gulp.watch('./src/js/calendar.js',  gulp.series('calendar'));
  return
});

gulp.task('default', gulp.series('main', 'maker', 'export', 'calendar', 'watch'));
