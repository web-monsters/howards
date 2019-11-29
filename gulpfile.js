const { src, watch, dest, series } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const del = require("del");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const pug = require('gulp-pug');
const concat = require('gulp-concat');


function cleanBuild () {
  return del('build/*');
}

function compileStyles() {
  console.log('compilingStyles');

  return src('src/styles/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('main.css'))
    .pipe(dest('build/'))
    .pipe(minify())
    .pipe(rename('style.min.css'));
}

function compilePug () {
  console.log('compiling Pug');

  return src('src/layouts/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(concat('index.html'))

    .pipe(dest('build/'));
}

async function buildProject () {
  await compilePug();
  await compileStyles();
}

function initServer() {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    notify: false,
    open: false,
    port: process.env.PORT || 3000,
  });
}

async function watchFiles() {
  await buildProject();
  initServer();

  watch('src/styles/**/*.scss').on('change', compileStyles);
  watch('src/layouts/**/*.pug').on('change', compilePug);

  watch('build/**/*.*').on('change', browserSync.reload);
}

exports.build = series(cleanBuild, buildProject);
exports.watch = series(cleanBuild, buildProject, watchFiles);

  // function zipImages() {
  //   return src('src/assets/img/**/*.{png, jpg, svg}')
  //     .pipe(imagemin([
  //       imagemin.optipng({ optimizationLevel: 3 }),
  //       imagemin.jpegtran({ progressive: true }),
  //       imagemin.svgo()
  //     ]))

  //     .pipe(dest('src/img'));
  // };



// gulp.task('webp', function () {
//   return gulp.src('source/assets/img/**/*.{png,jpg')
//     .pipe(webp({ quality: 90 }))
//     .pipe(gulp.dest('source/img'));
// });

// gulp.task('views', function buildHTML() {
//   return gulp.src('sourrce/layouts/**/*.pug')
//     .pipe(pug({

//     }))


// })

// gulp.task('images', function() {
//   return gulp.src('source/assets/img/**/*.{png, jpg, svg')
//       .pipe(imagemin([
//           imagemin.optipng({optimizationLevel: 3}),
//           imagemin.jpegtran({progressive: true}),
//           imagemin.svgo()
//       ]))

//       .pipe(gulp.dest('source/img'));
// });


// gulp.task("style", function() {
//   gulp
//     .src("source/scss/index.scss")
//     .pipe(plumber())
//     .pipe(sass())
//     .pipe(postcss([autoprefixer()])) 
//     .pipe(gulp.dest("build/css"))
//     .pipe(minify())
//     .pipe(rename("style.min.css"))
//     .pipe(server.stream());
// });



// gulp.task("serve", ["style"], function() {
//   server.init({
//     server: "source"
//   });

//   gulp.watch("source/scss/**/*.scss", ["style"]);
//   gulp.watch("source/*.html").on("change", server.reload);
// });