var gulp = require('gulp');
var sass = require('gulp-sass');
var bower = require('gulp-bower');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge2');

var themeDependencies = ['theme-open-ent', 'entcore-css-lib'];
var widgets = ['notes', 'calendar-widget', 'record-me'];

var childTheme = 'leo';
var parentTheme = 'theme-open-ent';

var localPaths = {
    themes: ['../entcore-css-lib/**/*', '../theme-open-ent/**/*'],
    widgets: ['../notes/**/*', '../calendar-widget/**/*', '../record-me/**/*']
};

var sourceDependency = [];

function widgetsSources() {
    var sources = [];
    widgets.forEach((dep) => {
        sources.push('./bower_components/' + dep + '/**/*');
    });
    return sources;
}

function themesSources() {
    var sources = [];
    themeDependencies.forEach((dep) => {
        sources.push('./bower_components/' + dep + '/**/*');
    });
    return sources;
}

gulp.task('clean', function(){
    return del([
        './assets/themes/*',
        '!./assets/themes/' + childTheme,
        './assets/themes/' + childTheme + '/*',
        '!./assets/themes/' + childTheme + '/override*'
    ]);
});

gulp.task('bower', ['clean'], () => {
    return bower({ cwd: '.' });
});

gulp.task('update', ['bower'], function () {
    var themes = gulp.src(themesSources(), { base: './bower_components' })
        .pipe(gulp.dest('./assets/themes'));
    
    var widgets = gulp.src(widgetsSources(), { base: './bower_components' })
        .pipe(gulp.dest('./assets/widgets'));

    return merge([themes, widgets]);
});

gulp.task('fill-theme', sourceDependency, function () {
    return gulp.src('./assets/themes/' + parentTheme + '/**/*')
        .pipe(gulp.dest('./assets/themes/' + childTheme));
});

gulp.task('copy-local', function () {
    var themes = gulp.src(localPaths.themes, {base: '../'})
        .pipe(gulp.dest('./assets/themes'));
    var widgets = gulp.src(localPaths.widgets, { base: '../' })
        .pipe(gulp.dest('./assets/widgets'));
    return merge([themes, widgets]);
});

gulp.task('override-theme', ['fill-theme'], function () {
    var overrides = ['img', 'js', 'fonts', 'template', 'default'];
    overrides.forEach((override) => {
        gulp.src(['./assets/themes/' + childTheme + '/override-' + override + '/**/*'])
            .pipe(gulp.dest('./assets/themes/' + childTheme + '/' + override));
    });
});

gulp.task('compile-sass', ['override-theme'], function () {
    gulp.src('./assets/themes/' + childTheme + '/default/theme.scss')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./assets/themes/' + childTheme + '/default'));

    gulp.src('./assets/themes/' + childTheme + '/dyslexic/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./assets/themes/' + childTheme + '/dyslexic'));
});


gulp.task('build-local', function(){
    sourceDependency.push('copy-local')
    return gulp.start('compile-sass')
});
gulp.task('build', function(){
    sourceDependency.push('update');
    return gulp.start('compile-sass');
});
