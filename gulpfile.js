var gulp = require('gulp');
var less = require('gulp-less');
var bower = require('gulp-bower');

gulp.task('update-libs', function () {
    return bower({ directory: './bower_components', cwd: '.' })
      .pipe(gulp.dest('./assets/themes'));
});

gulp.task('theme-leo', ['update-libs'], function () {
    gulp.src('./assets/themes/leo/default/*.less')
      .pipe(less())
      .pipe(gulp.dest('./assets/themes/leo/default'));
});

//copy themes elements on local to see tests
gulp.task('copy-theme-leo', function () {
    return gulp.src(['../theme-leo/**/*'])
     .pipe(gulp.dest('./assets/themes/leo'));
});

//copy themes elements on local to see tests
gulp.task('copy-css-lib', function () {
   return  gulp.src(['../css-lib/**/*'])
    .pipe(gulp.dest('./assets/themes/entcore-css-lib'));
});

// compile local css to test
gulp.task('compile-leo-css', ['copy-theme-leo', 'copy-css-lib'], function () {
   gulp.src('./assets/themes/leo/default/*.less')
     .pipe(less())
     .pipe(gulp.dest('./assets/themes/leo/default'));

   gulp.src('./assets/themes/leo/dyslexic/*.less')
     .pipe(less())
     .pipe(gulp.dest('./assets/themes/leo/dyslexic'));
});
