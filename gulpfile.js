const gulp = require('gulp');
const glob = require('glob');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const path = require('path');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const babel = require('rollup-plugin-babel');
const uglify = require('gulp-uglify');
const gulpStylelint = require('gulp-stylelint');
const replace = require('rollup-plugin-replace');
const zip = require('gulp-zip');
const postcss = require('gulp-postcss');
const px2rem = require('postcss-plugins-px2rem');
const resolve = require('rollup-plugin-node-resolve');
const merge = require('merge-stream');

var projectName = ['landing', 'ticket', 'lobster', 'huajiao', 'cnfr', 'pai'];

projectName.forEach((name) => {
  gulp.task(name, () => {
    // css
    var processors = [px2rem({remUnit: 75})];
    gulp.src(name + '/css/**/*.css')
      // .pipe(sourcemaps.init())
      .pipe(gulpStylelint({
        reporters: [
          {formatter: 'verbose', console: true}
        ],
        failAfterError: false
      }))
      .pipe(
        postcss([
          require('precss')({}),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ]
          }),
        ])
      ).pipe(postcss(processors))
      .pipe(gulp.dest(name + '/dist/css'))
      // .pipe(rename({suffix: '.min'}))
      // .pipe(cleanCss())
      // .pipe(gulp.dest(name + '/dist/css'))

    // js
    merge(glob.sync(name + '/js/entry/*.js').map(function(entry) {
      return rollup({
        entry: entry,
        format: 'umd',
        plugins: [
          replace({
            'process.env.NODE_ENV': JSON.stringify( 'production' )
          }),
          babel({
            presets: [
              [
                "es2015", {
                  "modules": false
                }
              ]
            ],
            babelrc: false,
            exclude: 'node_modules/**'
          }),
          resolve(),
        ]
      })
      .pipe(source(path.resolve(path.basename(entry, '.js') + '.bundle.js')))
      .pipe(gulp.dest(name + '/dist/js'))
      // .pipe(uglify())
      // .pipe(rename({suffix: '.min'}))
      // .pipe(gulp.dest(name + '/dist/js'));
    }))

    // gulp.src(name + '/**/*.html')
    //   .pipe(gulp.dest(name + '/dist/'));

    // font
    gulp.src(name + '/css/font/*')
      .pipe(gulp.dest(name + '/dist/css/font'));
  });

  gulp.task('watch-' + name , () => {
    livereload.listen();
    gulp.watch(name + '/{css,js}/**/*.{css,js}', [name]);
  });

  gulp.task('zip', function () {
    return gulp.src(['./**/**', '!node_modules/**', '!gulpfile.js', '!package.json', '!singlepicture-template.html', '!standard-template.html', '!yarn.lock', '!README.md'])
      .pipe(zip('dist.zip'))
      .pipe(gulp.dest('./'))
  });


  gulp.task(name + '-img', () => {
    gulp.src(name + '/img/*')
      .pipe(imagemin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
      }))
      .pipe(gulp.dest(name + '/dist/img'))
  });
})
