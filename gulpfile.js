var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var bower = require('gulp-bower');

var childtheme = 'leo';

var sourceDependency = [];

//recupere theme sur git & copy dans springboard
gulp.task('update-libs', function () {
    return bower({ directory: './assets/themes', cwd: '.' });
});

//copy dans childtheme ce qu'il a recup du theme (git)
gulp.task('fill-theme', sourceDependency, function () {
    return gulp.src('./assets/themes/theme-open-ent/**/*')
        .pipe(gulp.dest('./assets/themes/' + childtheme));
});


////////////////////////

//copy dans childtheme les dependances locales
gulp.task('copy-local', function () {
    //copy css-lib local
    return gulp.src(['../entcore-css-lib/**/*', '../theme-open-ent/**/*'], {base: '../'})
        .pipe(gulp.dest('./assets/themes'));
});

////////////////////////


//override dans childtheme les el specifique
gulp.task('override-theme', ['fill-theme'], function () {
    gulp.src(['./assets/themes/'+childtheme+'/override-img/**/*'])
        .pipe(gulp.dest('./assets/themes/'+childtheme+'/img'));

    gulp.src(['./assets/themes/'+childtheme+'/override-js/**/*'])
        .pipe(gulp.dest('./assets/themes/'+childtheme+'/js'));

    gulp.src(['./assets/themes/'+childtheme+'/override-template/**/*'])
        .pipe(gulp.dest('./assets/themes/'+childtheme+'/template'));
});


//compile sass
gulp.task('compile-sass', ['override-theme'], function () {
    //compile le css specifique dans le fichier default et ecrase le theme.css
    gulp.src('./assets/themes/'+childtheme+'/override-css/default/theme.scss')
      .pipe(sass())
      .pipe(gulp.dest('./assets/themes/'+childtheme+'/default'));

    gulp.src('./assets/themes/'+childtheme+'/dyslexic/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./assets/themes/'+childtheme+'/dyslexic'));
});


gulp.task('themes-local', function(){
    sourceDependency.push('copy-local')
    return gulp.start('compile-sass')
});
gulp.task('themes', function(){
    sourceDependency.push('update-libs')
    return gulp.start('compile-sass')
});

//attention supprimer le theme open-ent si on switch entre les 2 taches




// //watcher
// gulp.task('watch-css', function() {
//
//     function compileTheme() {
//         // //compile css-lib local
//         // gulp.src(['../css-lib/**/*'])
//         //     .pipe(gulp.dest('./assets/themes/entcore-css-lib'));
//         //
//         // //compile theme-open-ent local
//         // gulp.src(['../theme-open-ent/**/*'])
//         //     .pipe(gulp.dest('./assets/themes/theme-open-ent'));
//
//         //compile childtheme
//         gulp.src('./assets/themes/'+childtheme+'/default/theme.scss')
//             .pipe(sass())
//             .pipe(gulp.dest('./assets/themes/'+childtheme+'/default'));
//     }
//     watch('../css-lib/**/*.scss', compileTheme);
//     //watch theme-open-ent local
//     watch('../theme-open-ent/**/*.scss', compileTheme);
//     watch('./assets/themes/'+childtheme+'/**/*.scss', compileTheme);
//
// });
