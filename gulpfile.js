const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const px2rem = require('postcss-px2rem');
const runSequence = require('run-sequence');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const browserSync = require('browser-sync');
const fileinclude = require('gulp-file-include');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const htmlmin = require('gulp-htmlmin');


// 压缩css
gulp.task('miniCss', function() {
    return gulp.src(['src/statics/css/*.css'])
        //.pipe(postcss([px2rem({ remUnit: 100 }), autoprefixer()]))
        //.pipe(postcss([autoprefixer()]))
        .pipe(cssmin())
        .pipe(rev())  //css增加md5版本号，6位
        .pipe(gulp.dest('dist/statics/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

// 已经压缩过的css
gulp.task('copyCss', function() {
    return gulp.src('src/statics/css/min/*.css')
        .pipe(gulp.dest('dist/statics/css/min'))
});

// 已经压缩过的js
gulp.task('copyScripts', function() {
    return gulp.src('src/statics/js/min/*.js')
        .pipe(gulp.dest('dist/statics/js/min'))
});

// 压缩js
gulp.task('miniScripts', function() {
    return gulp.src('src/statics/js/*.js')
        .pipe(uglify({
            //mangle:false,//类型：Boolean 默认：true 是否修改变量名
            //compress:false,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(rev())  //css增加md5版本号，6位
        .pipe(gulp.dest('dist/statics/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});


gulp.task('font', function() {
    return gulp.src(['src/statics/font/**/*'])
        .pipe(gulp.dest('dist/statics/font'));
});

// 压缩图片
gulp.task('miniImages', function() {
    return gulp.src('src/statics/images/**/*')
        //.pipe(cache(imagemin({
        //    optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        //    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //})))
        .pipe(gulp.dest('dist/statics/images'))

});

// 给有引用静态资源的html更改引用的文件名字
gulp.task('rev', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(['rev/**/*.json', 'src/html/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});

// 开启服务，监听代码改动自动刷新页面
gulp.task('browserSyncInit', function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: '/index.html',
        },
        port: 8989
    })
});

// 清空dist
gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean()); //清除dist目录
});

// build组合
gulp.task('build', function(done) {
    runSequence(
        ['miniImages', 'font'], ['miniCss', 'copyCss'], ['miniScripts', 'copyScripts'], ['rev'], ['browserSyncInit'],
        done);

});

// 打包命令
gulp.task('default', function(done) {
    runSequence(
        ['clean'], ['build'],
        done);

});



// 开发模式

gulp.task('listenCss', function() {
    return gulp.src(['src/statics/css/**/*.css'])
        // .pipe(postcss([px2rem({remUnit: 100}), autoprefixer()]))
        // .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('test/statics/css'))
        .pipe(browserSync.stream());
})

// 监听js
gulp.task('listenScripts', function() {
    return gulp.src(['src/statics/js/**/*.js'])
        .pipe(gulp.dest('test/statics/js'))
        .pipe(browserSync.stream());
})

// 刷新html
gulp.task('htmlReload', function() {
    return gulp.src('src/html/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('test/html'))
        .pipe(browserSync.stream());
});

// 监听font
gulp.task('listenFont', function() {
    return gulp.src(['src/statics/font/**/*'])
        .pipe(gulp.dest('test/statics/font'))
        .pipe(browserSync.stream());
})

// 监听图片
gulp.task('listenImages', function() {
    return gulp.src('src/statics/images/**/*')
        .pipe(gulp.dest('test/statics/images'));

});


// 监听

gulp.task('watch', function() {
    gulp.watch('src/statics/css/**/*.css').on('change', function(file) {
        gulp.start('listenCss');
    });

    gulp.watch('src/statics/js/**/*.js').on('change', function(file) {
        gulp.start('listenScripts');
    });

    gulp.watch('src/html/**/*.html').on('change', function() {
        gulp.start('htmlReload');
    });

    gulp.watch('src/statics/images/**/*').on('change', function() {
        gulp.start('listenImages');
    });

});

// 清空test

gulp.task('cleanTest', function() {
    return gulp.src('test', { read: false })
        .pipe(clean()); //清除test目录
});

gulp.task('browserSyncTestInit', function() {
    browserSync.init({
        server: {
            baseDir: "./test",
            index: '/index.html',
        },
        port: 8989
    })
});

// dev组合
gulp.task('develop', function(done) {
    runSequence(
        ['listenImages', 'listenFont'], ['listenCss'], ['listenScripts'], ['htmlReload'], ['browserSyncTestInit'],
        done);

});

// 本地跑命令
gulp.task('dev', function(done) {
    runSequence(
        ['cleanTest'], ['develop'], ['watch'],
        done);
});