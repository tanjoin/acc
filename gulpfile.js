var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('generator', function() {
  return browserify({
    entries: './src/generator.ts'
  }).plugin('tsify')
  .bundle()
  .on('error', function(error) {
    console.log(error.message);
  })
  .pipe(source('generator.js'))
  .pipe(gulp.dest('./bin/js'));
});

gulp.task('main', function() {
  return browserify({
    entries: './src/main.ts'
  }).plugin('tsify')
  .bundle()
  .on('error', function(error) {
    console.log(error.message);
  })
  .pipe(source('main.js'))
  .pipe(gulp.dest('./bin/js'));
});

gulp.task('calendar', function() {
  return browserify({
    entries: './src/calendar.ts'
  }).plugin('tsify')
  .bundle()
  .on('error', function(error) {
    console.log(error.message);
  })
  .pipe(source('calendar.js'))
  .pipe(gulp.dest('./bin/js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**', ['main', 'generator', 'calendar']);
});

gulp.task('default', ['main', 'generator', 'calendar', 'watch']);
