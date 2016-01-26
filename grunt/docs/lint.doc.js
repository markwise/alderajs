module.exports = function (grunt, width) {
    'use strict';

    grunt.log.subhead('lint');
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'Validates src files using JSHint.'));
    grunt.log.writeln();
    grunt.log.writeln('    grunt lint');
};