var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('skin-leo', function () {
    gulp.src('./assets/themes/leo/default/*.less')
      .pipe(less())
      .pipe(gulp.dest('./assets/themes/leo/default'));

    gulp.src('./assets/themes/leo/dyslexic/*.less')
      .pipe(less())
      .pipe(gulp.dest('./assets/themes/leo/dyslexic'));
});