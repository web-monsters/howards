const { src, watch, dest, series } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const pug = require('gulp-pug');
const concat = require('gulp-concat');


function compileStyles() {
  return src('src/styles/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('main.css'))
    .pipe(dest('build/'))
    .pipe(minify())
    .pipe(rename('style.min.css'));
}


function initServer() {
  browserSync.init({
    server: {
      basedir: './'
    },
    notify: false
  });
}

function watchFiles() {
  initServer();

  watch('src/styles/*.scss').on('change', series(compileStyles, browserSync.reload));
  watch('src/app/**/*.pug').on('change', series(gulpPug, browserSync.reload));
};

exports.watch = watchFiles;


function gulpPug() {
  return src('src/layouts/**/*.pug')
    .pipe(pug({
      pretty: true
    }))

    .pipe(dest('build'));
}

exports.pug = gulpPug;


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