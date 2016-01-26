module.exports = function (grunt) {
    var config = './grunt/config/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        banner: [
            '/*\n',
            ' * Build Date: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n',
            ' *\n',
            ' * aldera.js v<%= pkg.version %>\n',
            ' * https://github.com/markwise/alderajs\n',
            ' *\n',
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>, contributers\n',
            ' * Released under the terms of the MIT license\n',
            ' */\n'
        ].join(''),
        
        output: '<%= pkg.name %>-<%= pkg.version %>',

        paths: {
            build:    'build', 
            src:      'src'
        },

        clean:  require(config + 'clean'),
        concat: require(config + 'concat')(grunt),
        copy:   require(config + 'copy'),
        jshint: require(config + 'jshint')
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('./grunt/tasks');
};