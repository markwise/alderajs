module.exports = function (grunt, width) {
    'use strict';

    grunt.log.subhead('dist');
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'Distribution build task.'));
    grunt.log.writeln();
    grunt.log.writeln('    grunt dist');
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'What it does:'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '1. Runs build task'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '2. Removes existing files in dist directory'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '3. Copies aldera.js from build to dist directory and appends package version to file name'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '4. Copies adapters from build directory to dist directory'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '5. Minifies aldera.js in build directory and outputs to dist directory'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '6. Generates a source map file'));
};