var gulp = require('gulp');
var sass = require('gulp-sass');
//var watch = require('gulp-watch');
var bower = require('gulp-bower');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');


var childTheme = 'leo';
var parentTheme = '/theme-open-ent/**/*';

var themePath = './assets/themes';
var localcsslib = '../entcore-css-lib/**/*';
var localparentTheme = '../theme-open-ent/**/*';

var sourceDependency = [];

gulp.task('clean', function(){
    return del([themePath + '/*', '!' + themePath + '/' + childTheme, themePath + '/' + childTheme + '/*',  '!' + themePath + '/' + childTheme + '/override*']);
});

//recupere theme sur git & copy dans springboard
gulp.task('update-libs', ['clean'], function () {
    return bower({ directory: themePath, cwd: '.' });
});

//copy dans childTheme ce qu'il a recup du theme (git)
gulp.task('fill-theme', sourceDependency, function () {
    return gulp.src(themePath + parentTheme)
        .pipe(gulp.dest(themePath + '/' + childTheme));
});


////////////////////////

//copy dans childTheme les dependances locales
gulp.task('copy-local', function () {
    //copy css-lib local
    return gulp.src([localcsslib, localparentTheme], {base: '../'})
        .pipe(gulp.dest(themePath));
});

////////////////////////


//override dans childTheme les el specifique
gulp.task('override-theme', ['fill-theme'], function () {
    gulp.src([themePath + '/' + childTheme+'/override-img/**/*'])
        .pipe(gulp.dest(themePath + '/' + childTheme + '/img'));

    gulp.src([themePath + '/' + childTheme + '/override-js/**/*'])
        .pipe(gulp.dest(themePath + '/' + childTheme+'/js'));

    gulp.src([themePath + '/' + childTheme + '/override-template/**/*'])
        .pipe(gulp.dest(themePath + '/' + childTheme + '/template'));
});


//compile sass
gulp.task('compile-sass', ['override-theme'], function () {
    //compile le css specifique dans le fichier default et ecrase le theme.css
    gulp.src(themePath + '/' + childTheme + '/override-css/default/theme.scss')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer())
      .pipe(gulp.dest(themePath + '/' + childTheme + '/default'));

    gulp.src(themePath + '/' + childTheme + '/dyslexic/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer())
      .pipe(gulp.dest(themePath + '/' + childTheme + '/dyslexic'));
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
//         //compile childTheme
//         gulp.src('./assets/themes/'+childTheme+'/default/theme.scss')
//             .pipe(sass())
//             .pipe(gulp.dest('./assets/themes/'+childTheme+'/default'));
//     }
//     watch('../css-lib/**/*.scss', compileTheme);
//     //watch theme-open-ent local
//     watch('../theme-open-ent/**/*.scss', compileTheme);
//     watch('./assets/themes/'+childTheme+'/**/*.scss', compileTheme);
//
// });
