module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('default', function () {
        require('../docs/help.doc')(grunt);
    });
};