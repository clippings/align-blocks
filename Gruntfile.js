module.exports = function (grunt) {

    'use strict'

    require('load-grunt-tasks')(grunt)

    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            options: {
                configFile: 'js/.eslintrc'
            },
            js: [
                'Gruntfile.js',
                'js/src/*.js',
                'js/tests/unit/*.js'
            ]
        },

        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip',
                    level: 9
                },
                src: ['dist/**', 'LICENSE', 'README.md']
            }
        },

        jscs: {
            options: {
                config: 'js/.jscsrc'
            },
            files: {
                src: [
                    'Gruntfile.js',
                    'js/src/*.js',
                    'js/tests/unit/*.js'
                ]
            }
        },

        concat: {
            options: {
                sourceMap: true,
                stripBanners: true,
                banner: '// LICENSE: <%= pkg.license %>\n// <%= pkg.homepage %>\n\n var AlignBlocks = (function () {\n\n\'use strict\'\n\n',
                footer: '\nreturn { Item: Item, Group: Group }\n\n})()',
                process: function (src) {
                    return src.replace('\'use strict\'', '')
                }
            },
            js: {
                src: 'js/src/*.js',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        qunit: {
            options: {
                coverage: {
                    src: 'js/src/*.js',
                    instrumentedFiles: 'temp/',
                    htmlReport: 'build/coverage',
                    lcovReport: 'build/'
                }
            },
            all: ['js/tests/index.html']
        },

        uglify: {
            options: {
                mangle: true,
                sourceMap: true,
                sourceMapIn: 'dist/js/<%= pkg.name %>.js.map',
                preserveComments: 'some'
            },
            core: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        }
    })

    grunt.registerTask('js', ['concat', 'uglify'])
    grunt.registerTask('test', ['eslint', 'jscs', 'qunit'])
    grunt.registerTask('dist', ['default', 'compress'])
    grunt.registerTask('default', ['js'])
}
