// dna.js Semantic Templates
// gulp configuration and tasks

// Periodically check dependencies:
//    $ cd dna.js
//    $ npm outdated
//    $ npm update

var gulp =         require('gulp');
var fileinclude =  require('gulp-file-include');
var filesize =     require('gulp-filesize');
var header =       require('gulp-header');
var htmlhint =     require('gulp-htmlhint');
var jshint =       require('gulp-jshint');
var rename =       require('gulp-rename');
var replace =      require('gulp-replace');
var uglify =       require('gulp-uglify');
var w3cjs =        require('gulp-w3cjs');
var del =          require('del');

var context = {
   pkg:        require('./package.json'),
   webRoot:    '..',
   size:       '16 kb',
   youTube: {
      intro:    'jMOZOI-UkNI',
      tutorial: 'juIru5qHZFM'
      },
   jsFiddle: {
      addABook:     '3ox4tbzm',
      bookFinder:   'kycnLazq',
      dataClick:    '16ytgdwe',
      liveModel:    'bupu9scn',
      smartUpdates: '0t7Lue3w',
      toDo:         'dovd6088'
      }
   };
context.title = context.pkg.dna.fullName;  //default page title
context.copyright = context.pkg.dna.copyright.replace('@@currentYear@@', new Date().getFullYear());
var banner = '//dna.js v' + context.pkg.version + ' ~~ dnajs.org/license\n';
var versionPatternStrs = [
   'js v',                     //example: /* dna.js v1.0.0 ~~ dnajs.org/license */
   '~~ v',                     //example: // dna.js Semantic Templates ~~ v1.0.0
   '"version":  "',            //example: "version":  "1.0.0",
   'Current release: \\*\\*v'  //example: Current release: **v1.0.0**
   ];
var versionPatterns = new RegExp('(' + versionPatternStrs.join('|') + ')[0-9.]*');
var httpdocsFolder = 'website/httpdocs';
var files = {
    html: ['*.html', 'website/*.html', 'website/httpdocs/*.html'],
    js:   ['dna.js', 'gulpfile.js', 'website/*.js']
    };
var htmlHintConfig = {
    'attr-value-double-quotes': false
    };
var jsHintConfig = {
    undef:  true,
    unused: true,
    predef: ['require', 'navigator', 'window', 'document', 'console', '$', 'jQuery', 'app', 'dna']
    };

function setVersionNumberDev() {
   gulp.src(['dna.js', 'dna.css'])
      .pipe(replace(versionPatterns, '$1' + context.pkg.version))
      .pipe(gulp.dest('.'));
   }

function setVersionNumberProd() {
   gulp.src(['bower.json', 'README.md'])
      .pipe(replace(versionPatterns, '$1' + context.pkg.version))
      .pipe(gulp.dest('.'));
   }

function runJsHint() {
   gulp.src(files.js)
      .pipe(jshint(jsHintConfig))
      .pipe(jshint.reporter());
   }

function runUglify() {
   gulp.src('dna.js')
      .pipe(rename('dna.min.js'))
      .pipe(uglify())
      .pipe(header(banner))
      .pipe(gulp.dest('.'));
   }

function reportSize() {
   gulp.src('dna*.js')
      .pipe(filesize());
   }

function cleanWebsite() {
    return del(httpdocsFolder + '/**');
    }

function buildWebsite() {
   gulp.src('website/static/**')
      .pipe(gulp.dest(httpdocsFolder));
   gulp.src('website/static/**/*.html')
      .pipe(w3cjs())
      .pipe(w3cjs.reporter())
      .pipe(htmlhint(htmlHintConfig))
      .pipe(htmlhint.reporter());
   gulp.src('website/root/**/*.html')
      .pipe(fileinclude({ basepath: '@root', indent: true, context: context }))
      // .pipe(w3cjs())   //need to fix: Element “style” not allowed as child
      // .pipe(w3cjs.reporter())
      .pipe(htmlhint(htmlHintConfig))
      .pipe(htmlhint.reporter())
      .pipe(gulp.dest(httpdocsFolder));
   }

gulp.task('dev',     setVersionNumberDev);
gulp.task('release', setVersionNumberProd);
gulp.task('jshint',  ['dev'], runJsHint);
gulp.task('uglify',  ['dev'], runUglify);
gulp.task('default', ['jshint', 'uglify'], reportSize);
gulp.task('clean',   cleanWebsite);
gulp.task('web',     ['clean'], buildWebsite);
