module.exports = function (grunt, width) {
    'use strict';

    grunt.log.writeln();
    grunt.log.writeln('build'['grey']);
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'Development build task.'));
    grunt.log.writeln();
    grunt.log.writeln('    grunt build'['cyan']);
    
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, 'What it does:'));
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, '1. Validates src files using JSHint'));
    grunt.log.writeln(grunt.log.wraptext(width, '2. Removes existing files in build directory'));
    grunt.log.writeln(grunt.log.wraptext(width, '3. Concatenates src files and outputs aldera.js to the build directory'));
    grunt.log.writeln(grunt.log.wraptext(width, '4. Copies template adapters to the build directory'));
    grunt.log.writeln(grunt.log.wraptext(width, '5. Removes existing code coverage reports in test/reports'));
    grunt.log.writeln(grunt.log.wraptext(width, '6. Runs unit tests against aldera.js using Jasmine and PhantomJS'));
    grunt.log.writeln(grunt.log.wraptext(width, '7. Generates a code coverage report in test/reports/phantomjs'));
};