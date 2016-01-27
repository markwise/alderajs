module.exports = function (grunt, width) {
    'use strict';

    grunt.log.writeln();
    grunt.log.writeln('lint'['grey']);
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'Validates src files using JSHint.'));
    grunt.log.writeln();
    grunt.log.writeln('    grunt lint'['cyan']);
};