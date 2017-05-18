var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('ts', function() {
  return browserify({
    entries: './src/ts/app.ts'
  }).plugin('tsify')
  .bundle()
  .on('error', function(error) {
    console.log(error.message);
  })
  .pipe(source('app.js'))
  .pipe(gulp.dest('./bin/js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/ts/**', ['ts']);
});

gulp.task('default', ['ts', 'watch']);
