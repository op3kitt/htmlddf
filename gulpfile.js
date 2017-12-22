del = require('del');
gulp = require('gulp');
sass = require('gulp-sass');
pug = require('gulp-pug');
plumber = require('gulp-plumber');
notify = require('gulp-notify');
watchify = require('gulp-watchify');
cssnano = require('gulp-cssnano');
rename = require('gulp-rename');
buffer = require('vinyl-buffer');
sourcemaps = require('gulp-sourcemaps');
exec = require('child_process').exec;

gulp.task('clean', function(){
  del(['build/**/*', '!build/js', '!build/js/lib']);
});

gulp.task('release', [
    'build:pug',
    'build:scss',
    'build:asset',
    'build:ddf',
    'browserify'
]);

gulp.task('default', ['build']);
gulp.task('build', [
  'build:pug',
  'build:scss',
  'build:asset'
]);

gulp.task('build:pug', function(){
  gulp.src('src/pug/**/[!_]*.pug')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('build/'));
});

gulp.task('build:scss', function(){
  gulp.src('src/scss/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(cssnano({zindex: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('build:asset:local', function(){
  gulp.src(['src/vender/**', 'local/**'])
    .pipe(gulp.dest('build'));
});
gulp.task('build:asset', function(){
  gulp.src(['local/**', 'src/vender/**'])
    .pipe(gulp.dest('build'));
});

watching = false;
gulp.task('enable-watch-mode', function(){watching = true;});
debugging = false;
gulp.task('enable-debug-mode', function(){debugging = true;});
gulp.task('browserify', watchify(function(watchify){
    gulp.src('src/js/index.js')
      .pipe(sourcemaps.init())
      .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
      .pipe(watchify(debugging?{
        watch: watching
      }:{
        watch: watching,
        transform: ['uglifyify']
      }))
      .pipe(buffer())
      .pipe(sourcemaps.write('.maps'))
      .pipe(gulp.dest('build/js/'));
  })
);

gulp.task('build:ddf', ['doc:ddf'], function(){
  exec('browserify -r ddf -g uglifyify --outfile build/js/lib/ddf.js', function(a,b,c){
    exec('echo var ddf = require("ddf");>> build/js/lib/ddf.js');
  });
});

gulp.task('watchify', ['enable-watch-mode', 'enable-debug-mode', 'browserify']);
gulp.task('watch', ['build:pug', 'build:scss', 'build:asset:local', 'build:ddf', 'watchify'], function(){
  gulp.watch('src/pug/**/*.pug', ['build:pug']);
  gulp.watch('src/scss/**/*.scss', ['build:scss']);
  gulp.watch('src/module/*.js', ['build:ddf']);
  gulp.watch(['local/**', 'src/vender/**'], ['build:asset:local']);
});

gulp.task('doc:ddf', function(){
  exec('jsdoc -c .jsdoc.json');
});
