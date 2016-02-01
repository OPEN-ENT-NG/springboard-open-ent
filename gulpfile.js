var gulp = require('gulp');
var bower = require('gulp-bower');
var sass = require('gulp-sass');

gulp.task('update-libs', function () {
    return bower({ directory: './bower_components', cwd: '.' })
      .pipe(gulp.dest('./assets/themes'));
});

gulp.task('themes', ['update-libs'], function () {
    return gulp.src('./assets/themes/**/theme.scss')
      .pipe(sass())
      .pipe(gulp.dest('./assets/themes'));
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
   gulp.src('./assets/themes/leo/default/*.scss')
     .pipe(sass())
     .pipe(gulp.dest('./assets/themes/leo/default'));

   gulp.src('./assets/themes/leo/dyslexic/*.scss')
     .pipe(sass())
     .pipe(gulp.dest('./assets/themes/leo/dyslexic'));
});
