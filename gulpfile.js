// ========================================================================
// Подключение модулей
// ========================================================================
var gulp = require('gulp'),
	CompileStylus = require('gulp-stylus'),
	pug           = require('gulp-pug'),
	fs            = require("fs-extra"),
	pugBeautify   = require('gulp-pug-beautify'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'), // для конкатенации файлов
	uglify        = require('gulp-uglify'), // для сжатия JS
	cssnano       = require('gulp-cssnano'), // для минификации CSS
	rename        = require('gulp-rename'), // для переименования файлов
	del           = require('del'), // для удаления файлов и папок
	cache         = require('gulp-cache'), // библиотека кеширования
	autoprefixer  = require('autoprefixer'), // для автоматического добавления префиксов
	imagemin      = require('gulp-imagemin'), // для работы с изображениями
	pngquant      = require('imagemin-pngquant'), // для сжатия png
	imageminJpegtran = require('imagemin-jpegtran'), // для сжатия jpg
	imageminGifsicle = require('imagemin-gifsicle'), // для сжатия gif
	imageminSvgo = require('imagemin-svgo'), // для сжатия svg
	gulp_postcss = require('gulp-postcss'),
	datauri = require('postcss-data-uri'),
	mergeRules = require('postcss-merge-rules'), // объединяет селекторы с одинаковыми свойствами
	combineCssMedia = require('css-mqpacker'), // объединяет @media, помещает их в конец css. Работает через postcss. Не очень хорошо, что базовые свойства макета находятся в конце файла.
	htmlbeautify = require('gulp-html-beautify'),
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	modifyCssUrls = require('gulp-modify-css-urls'), // меняет пути к файлам в css
	postcss_inline_svg = require('postcss-inline-svg'),
	replace = require('gulp-replace');
	//purify = require('gulp-purifycss'); // убирает неиспользуемые стили




// В квадратных скобках указываются таски, котоыре должны выполниться ДО текущего таска

// ========================================================================
// Компиляция
// ========================================================================
// Stylus, в папку test
gulp.task('__compileStylus', function () {
	var $postcss_plugins = [
		postcss_inline_svg,
		autoprefixer({
			browsers: [
				//"last 2 versions",
				"> 0%",
				"Firefox >= 30",
				"ie <= 11" // версии поддерживаемых браузеров
			],
			cascade: false
		}),
		mergeRules
		/*combineCssMedia({
			sort: true
		})*/
	];

	return gulp.src('src/styl/bundle.styl')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(CompileStylus({'include css': true}))
		.pipe(gulp_postcss($postcss_plugins))
		.pipe(gulp.dest('test/css'))
		.pipe(browserSync.reload({stream: true}));
});

// Stylus, в папку docs
gulp.task('__compileStylus_docs', function () {
	var $postcss_plugins = [
		postcss_inline_svg,
		autoprefixer({
			browsers: [
				"last 2 versions",
				"> 5%",
				"Firefox >= 30" // версии поддерживаемых браузеров
			],
			cascade: false
		}),
		mergeRules
		/*combineCssMedia({
			sort: true
		})*/
	];

	return gulp.src('src/styl/bundle.styl')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(CompileStylus({'include css': true}))
		.pipe(gulp_postcss($postcss_plugins))
		.pipe(gulp.dest('docs/css'))
		.pipe(browserSync.reload({stream: true}));
});

// Pug
gulp.task('__compilePug', function () {
	return gulp.src([
		'src/pug/**/*.pug',
		'!src/pug/-helpers/**/*',
		'!src/pug/-templates/**/*',
		'!src/pug/**/*.inc.pug',
		'!src/pug/**/*.tpl.pug',
		'!src/pug/**/*--inc.pug',
		'!src/pug/**/*--tpl.pug',
		'!src/pug/**/_*.pug'
	])
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(pug()) // разметка НЕ в одну строку
		//.pipe(pug({pretty: true})) // разметка НЕ в одну строку
		.pipe(htmlbeautify({
			"indent_with_tabs": true
		}))
		.pipe(gulp.dest("test"))
		.pipe(browserSync.reload({stream: true}));
});






// ========================================================================
// Объединение файлов
// ========================================================================
// JS
gulp.task('__mergeJS', function() {
	return gulp.src(require('./src/js/js-list.json')) // список подключаемых файлов. Если подключаем один файл, то убрать скобки и запятые
		.pipe(plumber())
		.pipe(concat('bundle.js')) // собираем их в кучу в новом файле
		.pipe(gulp.dest('test/js')) // сохраняем в папку
		.pipe(browserSync.reload({stream: true}));
});

















// ========================================================================
// Удаление папок
// ========================================================================
// docs
gulp.task('__deldocs', function() {
	return del('docs');
});
// test
gulp.task('__delTest', function() {
	return del('test');
});









// ========================================================================
// Билд
// ========================================================================

// →  "test"
gulp.task('Build--Test', gulp.parallel('__compileStylus', '__mergeJS', '__compilePug', function(cb) {
		// Шрифты
		gulp.src('src/fonts/**/*')
			.pipe(gulp.dest('test/fonts'));

		// Images
		gulp.src('src/imgs/**/*')
			.pipe(gulp.dest('test/imgs'));

		cb();
	})
);

// → "docs"
gulp.task('Build', gulp.series(gulp.parallel('__delTest', '__deldocs'), gulp.parallel('__compileStylus','__compilePug', '__mergeJS'), function(cb) {
	// Шрифты
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('docs/fonts'));

	// Images (с оптимизацией)
	gulp.src('src/imgs/**/*') // выбираем папку с исходными изображениями
		.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 7}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		])))
		.pipe(gulp.dest('docs/imgs'));

	// Copy html
	gulp.src('test/**/*.html')
		.pipe(gulp.dest("docs"));

	// CSS
	gulp.src('test/css/**/*.css')
		/*.pipe(purify(['test/!**!/!*.html'], { // убирает неиспользуемые стили
			whitelist: require('./src/js/whitelist-purify.json') // массив с селекторами. Array of selectors to always leave in. Ex. ['button-active', '*modal*'] this will leave any selector that includes modal in it and selectors that match button-active. (wrapping the string with *'s, leaves all selectors that include it)
		}))*/
		//.pipe(gulp_postcss($postcss_plugins))
		// Добавляем суффикс .min
		//.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		/*.pipe(modifyCssUrls({ // Меняет пути к файлам в css
			modify: function (url, filePath) {
				return '/assets/docs' + url;
			}/!*,
			prepend: 'https://fancycdn.com/',
			append: '?cache-buster'*!/
		}))*/
		// Меняет пути к файлам в css
		//.pipe(replace('\"/fonts', '\"/assets/docs/fonts'))
		//.pipe(replace('\'/fonts', '\'/assets/docs/fonts'))
		.pipe(cssnano()) // Сжимаем
		.pipe(gulp.dest('docs/css')); // сохраняем в папку

	// Сжатие JS
	gulp.src('test/js/**/*.js')
		.pipe(plumber())
		.pipe(uglify()) // сжимаем JS файл
		.pipe(gulp.dest('docs/js'));

	// Copy .txt
	gulp.src('src/*.txt')
		.pipe(gulp.dest("docs"));

	cb();
}));





// ========================================================================
// Watch (следит за изменниями файлов и компилирует в папку test)
// ========================================================================
// Следит за папкой "test"
gulp.task('Watch--Test', gulp.series('Build--Test', function(cb) {
		gulp.watch('src/styl/**/*.styl',  gulp.series('__compileStylus'));
		gulp.watch(['src/**/*.pug','!src/helpers/**/*'],  gulp.series('__compilePug'));

		cb();
	})
);

// Следит за папкой "test" и открывает в браузере
gulp.task('LiveReload', gulp.series('Build--Test', function(cb) {
		browserSync({ // выполняем browserSync
			server: { // определяем параметры сервера
				baseDir: 'test' // директория для сервера

			},
			port: 3087,
			notify: false // отключаем уведомления
		});
		gulp.watch('src/styl/**/*.styl',  gulp.series('__compileStylus'));
		gulp.watch('src/**/*.pug',  gulp.series('__compilePug'));
		gulp.watch('src/js/**/*.js',  gulp.series('__mergeJS')); // следит за изменениями в js

		cb();
	})
);





// Задача по-умолчанию
gulp.task('default', gulp.series('LiveReload'));