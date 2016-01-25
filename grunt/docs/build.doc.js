module.exports = function (grunt, width) {
    'use strict';

    grunt.log.subhead('build');
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'Development build task.'));
    grunt.log.writeln();
    grunt.log.writeln('    grunt build');
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'What it does:'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '1. Removes existing files in build directory'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '2. Concatenates src files and outputs aldera.js to the build directory'));
};