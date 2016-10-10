// starter code from https://coderwall.com/p/xyi9ww/simple-gulp-starter
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var striplog = require('gulp-strip-debug');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minfycss = require('gulp-minify-css');
// var uncss = require('gulp-uncss');

// paths
var destFolder = 'dist';
var htmlPaths = ['src/*.html'];
var cssPaths = ['src/css/*.css', 'node_modules/bootstrap/dist/css/bootstrap.css'];
var fontPaths = ['src/fonts/*.*'];
// files must be in the order that they are getting loaded
var jsPaths = [
    'node_modules/knockout/build/output/knockout-latest.debug.js',
    'src/js/default_locations.js',
    'src/js/viewmodel.js',
    'src/js/main.js',
    'src/js/*.js'
];

// task definitions
// copy html files to destpath
gulp.task("htmls", function() {
    return gulp.src(htmlPaths)
        .pipe(gulp.dest(destFolder));
});

// copy fonts
gulp.task("fonts", function() {
    return gulp.src(fontPaths)
        .pipe(gulp.dest((destFolder + '/fonts')));
});
gulp.task('minscripts', function() {
    // pipe the js through concat, console log stripping, uglification and then store
    return gulp.src(jsPaths)
        .pipe(concat('app.min.js')) // concat all files in the src
        .pipe(striplog())
        .pipe(uglify()) // uglify them all
        .pipe(gulp.dest(destFolder)) // save the file
        .on('error', gutil.log);
});

gulp.task('scripts', function() {
    // pipe the js through concat and then store
    return gulp.src(jsPaths)
        .pipe(concat('app.min.js')) // concat all files in the src
        .pipe(gulp.dest(destFolder)) // save the file
        .on('error', gutil.log);
});

gulp.task('css', function() {
    // Concat all the css
    return gulp.src(cssPaths)
        .pipe(concat('app.min.css')) // concat all files in the src
        .pipe(gulp.dest(destFolder)) // save the file
        .on('error', gutil.log);
});

gulp.task('mincss', function() {
    // Concat and minify all the css
    return gulp.src(cssPaths)
        .pipe(concat('app.min.css')) // concat all files in the src
        // .pipe(uncss({ html: htmlPaths })) // remove unused css defs
        .pipe(minfycss()) // uglify them all
        .pipe(gulp.dest(destFolder)) // save the file
        .on('error', gutil.log);
});

// Clean all builds
gulp.task('clean', function() {
    return gulp.src(['dist'], { read: false })
        .pipe(clean());
});

// for production task minify all files
gulp.task('prod', ['clean'], function() {
    gulp.start('mincss', 'minscripts', 'htmls', 'fonts');
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'scripts', 'htmls', 'fonts');
});

// watch for file changes
gulp.task('watch', function() {
    gulp.watch(jsPaths, ['scripts']);
    gulp.watch(cssPaths, ['css']);
    gulp.watch(htmlPaths, ['htmls']);
});