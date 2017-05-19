module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //合并文件
        concat: {
            options: {
                separator: ';'
            },
            /*index: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/lib/angular/angular.js',
                    'public/phone/webapp.js',
                    'public/phone/services/user.client.service.js',
                    'public/phone/controllers/user.client.controller.js'
                ],
                dest: 'public/phone/dist/index.js'
            },*/
            live: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/lib/angular/angular.js',
                    'public/lib/socket.io/socket.io.js',
                    'public/phone/webapp.js',
                    'public/phone/services/live.client.service.js',
                    'public/phone/controllers/live.client.controller.js',
                    'public/phone/js/menu.js',
                    'public/phone/js/live.js'
                ],
                dest: 'public/phone/dist/live.js'
            },
            consulting: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/lib/angular/angular.js',
                    'public/lib/socket.io/socket.io.js',
                    'public/phone/webapp.js',
                    'public/phone/services/live.client.service.js',
                    'public/phone/controllers/live.client.controller.js',
                    'public/phone/js/menu.js',
                    'public/phone/js/consulting.js'
                ],
                dest: 'public/phone/dist/consulting.js'
            },
            /*user: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/lib/suimobile/sm-city-picker.min.js',
                    'public/lib/angular/angular.js',
                    'public/phone/webapp.js',
                    'public/phone/services/user.client.service.js',
                    'public/phone/controllers/user.client.controller.js',
                    'public/phone/js/menu.js',
                    'public/phone/js/user.js'
                ],
                dest: 'public/phone/dist/user.js'
            },*/
            /* page: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/phone/js/menu.js'
                ],
                dest: 'public/phone/dist/page.js'
            },*/
            /*playback: {
                src: [
                    'public/lib/suimobile/zepto.min.js',
                    'public/lib/suimobile/sm.min.js',
                    'public/phone/js/menu.js',
                    'public/phone/js/playback.js'
                ],
                dest: 'public/phone/dist/playback.js'
            },*/
            //后台
            /*login: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/admin/js/components.js',
                    'public/admin/js/login.js'
                ],
                dest: 'public/admin/dist/login.js'
            },*/
            /*system: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/lib/calendar/jquery-calendar.js',
                    'public/admin/js/components.js',
                    'public/admin/js/menu.js',
                    'public/admin/js/system.js'
                ],
                dest: 'public/admin/dist/system.js'
            },*/
            /*distribution: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/admin/js/components.js',
                    'public/admin/js/page.js',
                    'public/admin/js/menu.js',
                    'public/admin/js/distribution.js'
                ],
                dest: 'public/admin/dist/distribution.js'
            },*/
            /*register: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/admin/js/components.js',
                    'public/admin/js/register.js',
                ],
                dest: 'public/admin/dist/register.js'
            },*/
            /*account: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/lib/moment/moment.min.js',
                    'public/admin/js/components.js',
                    'public/admin/js/page.js',
                    'public/admin/js/menu.js',
                    'public/admin/js/account.js'
                ],
                dest: 'public/admin/dist/account.js'
            },*/
            /*page: {
                src: [
                    'public/lib/jquery/jquery.min.js',
                    'public/lib/bootstrap/bootstrap.min.js',
                    'public/lib/simditor/scripts/module.min.js',
                    'public/lib/simditor/scripts/hotkeys.min.js',
                    'public/lib/simditor/scripts/uploader.min.js',
                    'public/lib/simditor/scripts/simditor.min.js',
                    'public/admin/js/components.js',
                    'public/admin/js/page.js',
                    'public/admin/js/menu.js',
                    'public/admin/js/infoPage.js'
                ],
                dest: 'public/admin/dist/infoPage.js'
            }*/
        },
        //压缩文件
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            /*index: {
                src: 'public/phone/dist/index.js',
                dest: 'public/phone/dist/index.min.js'
            },*/
            live: {
                src: 'public/phone/dist/live.js',
                dest: 'public/phone/dist/live.min.js'
            },
            consulting: {
                src: 'public/phone/dist/consulting.js',
                dest: 'public/phone/dist/consulting.min.js'
            },
              /* user: {
                src: 'public/phone/dist/user.js',
                dest: 'public/phone/dist/user.min.js'
            },
            page: {
                src: 'public/phone/dist/page.js',
                dest: 'public/phone/dist/page.min.js'
            },*/
            /*playback: {
                src: 'public/phone/dist/playback.js',
                dest: 'public/phone/dist/playback.min.js'
            },*/
            //后台
            /*login: {
                src: 'public/admin/dist/login.js',
                dest: 'public/admin/dist/login.min.js'
            },*/
            /*system: {
                src: 'public/admin/dist/system.js',
                dest: 'public/admin/dist/system.min.js'
            },*/
            /*distribution: {
                src: 'public/admin/dist/distribution.js',
                dest: 'public/admin/dist/distribution.min.js'
            },*/
            /*register: {
                src: 'public/admin/dist/register.js',
                dest: 'public/admin/dist/register.min.js'
            },*/
            /*account: {
                src: 'public/admin/dist/account.js',
                dest: 'public/admin/dist/account.min.js'
            },*/
           /* page: {
                src: 'public/admin/dist/infoPage.js',
                dest: 'public/admin/dist/infoPage.min.js'
            }*/
        },
        //编译less
        less: {
            development: {
                files: {
                    "public/phone/css/index.css": "public/phone/less/index.less",
                     /*"public/phone/css/live.css": "public/phone/less/live.less",
                    "public/phone/css/user.css": "public/phone/less/user.less",
                    "public/phone/css/playback.css": "public/phone/less/playback.less",
                    "public/admin/css/login.css": "public/admin/less/login.less",
                    "public/admin/css/system.css": "public/admin/less/system.less",
                    "public/admin/css/distribution.css": "public/admin/less/distribution.less",
                    "public/admin/css/account.css": "public/admin/less/account.less"*/
                }
            }
        },
        //px转rem
        px2rem: {
            options: {
                ignore0: true, // ignore 0px default true
                ignore1: true, // ignore 1px default true
                root: 20 // set root fontsize, default 32
            },
            css: { // seperate
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'public/phone/css', // Src matches are relative to this path
                    src: ['*.css'], // Actual patterns to match
                    dest: 'public/phone/css' // Destination path prefix
                }]
            },
            // combin: { // concat all and convert
            //     src: ['public/index.css', 'public/index2.css'],
            //     dest: 'dest/all.css'
            // }
        },
        //监测文件自动执行任务
        watch: {
            scripts: {
                files: ['public/**/js/*.js'],
                tasks: ['concat','uglify'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/phone/controllers/*.js'],
                tasks: ['concat','uglify'],
                options: {
                    livereload: true
                }
            },
            less :{
                files:['public/phone/less/*.less'],
                tasks:['less','px2rem'],
                options: {
                    livereload: true
                }
            },
            adminless :{
                files:['public/admin/less/*.less'],
                tasks:['less'],
                options: {
                    livereload: true
                }
            }
        }

    });

    // 加载插件。
    grunt.loadNpmTasks('grunt-contrib-uglify'); //压缩
    grunt.loadNpmTasks('grunt-contrib-concat'); //合并
    grunt.loadNpmTasks('grunt-contrib-watch'); //自动任务
    grunt.loadNpmTasks('grunt-contrib-less'); //编辑less
    grunt.loadNpmTasks('grunt-px2rem'); //px转rem

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['watch']);

};