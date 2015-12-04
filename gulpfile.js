var gulp = require('gulp');
var less = require('gulp-less');
var bower = require('gulp-bower');

gulp.task('update-libs', function () {
    return bower(({ cwd: './assets/themes/leo' }))
      .pipe(gulp.dest('./assets/themes/leo/lib'));
});

gulp.task('theme-leo', ['update-libs'], function () {
    gulp.src('./assets/themes/leo/default/*.less')
      .pipe(less())
      .pipe(gulp.dest('./assets/themes/leo/default'));

    gulp.src('./assets/themes/leo/dyslexic/*.less')
      .pipe(less())
      .pipe(gulp.dest('./assets/themes/leo/dyslexic'));
});