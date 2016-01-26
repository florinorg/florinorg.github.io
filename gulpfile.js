'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var minifyCss   = require('gulp-minify-css');

// JS dependencies
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/*.sass')
        .pipe(sass({
            includePaths: ['sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 3 versions', '> 2%', 'ie 9', 'safari 9'], { cascade: true }))
        .pipe(minifyCss())
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Compile the Javascript files
 */
gulp.task('scripts', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './js/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('main.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./_site/js/'))
    .pipe(gulp.dest('js'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('default', ['scripts','browser-sync'], function() {
    gulp.watch(['_scss/*.sass', ], ['sass']);
    gulp.watch([
               '*.html',
               '_layouts/*.html',
               'ivan/*.html',
               '_includes/*.html'
               ],
               ['jekyll-rebuild']);
});
