const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const watchify = require('gulp-watchify');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const childProcess = require('child_process');
const fs = require('fs');
const log = require('fancy-log');
const zip = require('gulp-zip');

gulp.task('clean', function(){
  del(['build/**/*', '!build/js', '!build/js/lib']);
});

gulp.task('release', [
    'build:pug',
    'build:scss',
    'build:asset',
    'build:ddf',
    'release:doc',
    'browserify']);

gulp.task('release:zip', [], function(){
  const version = require("./package.json").version;
  gulp.src('build/**')
    .pipe(zip(`htmlDodontoF_${version}.zip`))
    .pipe(gulp.dest('.'));
});

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
  return;
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
gulp.task('release:doc', function(){
  gulp.src(['LICENSE', 'README.md', 'UPDATE_LOG.txt'])
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

const BUILD_DDF = 'build:ddf';
gulp.task(BUILD_DDF, [], () => {
  const OUT_FILE = 'build/js/lib/ddf.js';

  try {
    childProcess.execSync(`browserify -r ddf -g uglifyify --outfile ${OUT_FILE}`);
  } catch (e) {
    log.error(`${BUILD_DDF}: execSync: ${e.message}`);
    return;
  }

  log.info(`${BUILD_DDF}: Browserified ddf`);

  var fd;
  try {
    // 出力されたファイルを追記モードで開く
    fd = fs.openSync(OUT_FILE, 'a');
  } catch (e) {
    log.error(`${BUILD_DDF}: openSync: ${e.message}`);
    return;
  }

  var success = true;
  try {
    // グローバル変数ddfの定義を追記する
    fs.writeSync(fd, '\nvar ddf = require("ddf");\n');
  } catch (e) {
    log.error(`${BUILD_DDF}: writeSync: ${e.message}`);
    success = false;
  }

  try {
    fs.closeSync(fd);
  } catch (e) {
    log.error(`${BUILD_DDF}: closeSync: ${e.message}`);
  }

  if (success) {
    log.info(`${BUILD_DDF}: Output ${OUT_FILE}`);
  }
});

gulp.task('watchify', ['enable-watch-mode', 'enable-debug-mode', 'browserify']);
gulp.task('watch', ['build:pug', 'build:scss', 'build:asset:local', 'build:ddf', 'watchify'], function(){
  gulp.watch('src/pug/**/*.pug', ['build:pug']);
  gulp.watch('src/scss/**/*.scss', ['build:scss']);
  gulp.watch('src/ddf/*.js', ['build:ddf']);
  gulp.watch(['local/**', 'src/vender/**'], ['build:asset:local']);
});

