/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    // node libs.
    var path = require('path');

    // internal libs.
    var profileUtil = require('./lib/utils/profile');
    var log = require('./lib/utils/log');
    var file = require('./lib/utils/file');

    var startTime = new Date();
    var pkg = file.readJSON('package.json');

    function getSourceRootDirname(path) {
        return path.split('/').pop();
    }

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: pkg,
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> frontend@ablesky.com;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            options: {
                // overrides this task from blocking deletion of folders outside current working dir (CWD)
                force: true
            },
            image: {
                src: ['<%= pkg.config.dest_img %>']
            },
            css: {
                src: ['<%= pkg.config.dest_css %>']
            },
            js: {
                src: ['<%= pkg.config.dest_js %>']
            },
            jsp: {
                src: ['<%= pkg.config.dest_jsp %>']
            }
        },
        jshint: {
            ablejs: {
                options: {
                    // http://www.jshint.com/docs/options/
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
            },
            develop: {
                options: {
                    // http://www.jshint.com/docs/options/
                    jshintrc: 'conf/.jshintrc'
                },
                base: 'dist/jshint/',
                src: ['<%= jshint.develop.base %>**/*.js']
            }
        },
        copy: {
            css: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_css %>',
                // match all files ending with .css in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['api/ablesky.api.login.css'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_css %>',
                filter: 'isFile'
            },
            js: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_js %>',
                // match all match files in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['api/ablesky.api.login.js', 'tinymce/**'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_js %>',
                filter: 'isFile'
            }
        },
        concat: {
            options: {
                banner: '' // do not add <%= banner %> in concat task.
            },
            css: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_css %>',
                files: profileUtil.getConcats('css')
            },
            js: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_js %>',
                files: profileUtil.getConcats('js')
            }
        },
        optiimg: {
            files: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_img %>',
                // match all files in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['**/*', '!**/*.psd'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_img %>',
                filter: 'isFile'
            }
        },
        opticss: {
            options: {
                banner: '<%= banner %>'
            },
            files: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_css %>',
                // match all files ending with .css in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['**/*.css', '!api/ablesky.api.login.css'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_css %>'
            }
        },
        optijs: {
            options: {
                banner: '<%= banner %>'
            },
            files: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_js %>',
                // match all files ending with .js in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['**/*.js', '**/*.swf', '!tinymce/**/*.js'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_js %>'
            }
        },
        optijsp: {
            options: {
                jsBasePath: '<%= pkg.config.src_js %>',
            },
            files: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.src_jsp %>',
                // match all files ending with .js in the ${cwd}/ subdirectory and all of its subdirectories.
                src: ['**/*.jsp'],
                // Destination path prefix.
                dest: '<%= pkg.config.dest_jsp %>'
            }
        },
        replace: {
            jsp: {
                // Src matches are relative to this path.
                cwd: '<%= pkg.config.dest_jsp %>',
                src: ['**/*.jsp'],
                // toreplace can be regexp | str
                toreplace: /<%=staticsServer%>images/g,
                newstring: '<%=imgPath%>'
            }
        },
        chrono: {
            options: {
                start: startTime
            }
        },
        patch: {
            options: {
                // the flag can turn on/off the jshint task at patch task.
                jshint: false,
                // the path to run jshint task
                jshintpath: '<%= jshint.develop.base %>',
                root: {
                    img: getSourceRootDirname(pkg.config.src_img),
                    css: getSourceRootDirname(pkg.config.src_css),
                    js: getSourceRootDirname(pkg.config.src_js),
                    jsp: getSourceRootDirname(pkg.config.src_jsp)
                }
            }
        }
    });

    // load custom tasks. 
    grunt.loadTasks('lib/tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('build', ['clean', 'concat', 'copy', 'optiimg', 'opticss', 'optijs', 'optijsp', 'chrono']);
    grunt.registerTask('default', 'A tip for show help.', function() {
        log.writeln('Try `ablejs -h` or `ablejs --help` for more information.'.help);
    });

};