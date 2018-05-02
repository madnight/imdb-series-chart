import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import ghPages from 'gulp-gh-pages-will'

gulp.task('deploy', () => gulp.src('./public/**/*').pipe(ghPages()) )

gulp.task('minify', () => {
    return gulp.src('./public/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('public'))
})
