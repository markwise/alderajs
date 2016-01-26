module.exports = function (grunt) {
    'use strict';

    var col1Width = 15;
    var col2Width = 80;

    grunt.log.subhead('help');
    grunt.log.writeln();

    grunt.log.writeln('You are running grunt version ' + grunt.version['cyan'] + '.');
    grunt.log.writeln();
    grunt.log.writeln('Use ' + 'grunt help:<task>'['cyan'] + ' for usage info.');

    grunt.log.subhead('Tasks:');
    grunt.log.writeln();

    grunt.log.writeln(
        grunt.log.table([col1Width, col2Width], [
            'help',
            'View task usage info'
        ])
    );
    
    grunt.log.writeln(
        grunt.log.table([col1Width, col2Width], [
            'lint',
            'Validate src files using JSHint'
        ])
    );

    grunt.log.writeln(
        grunt.log.table([col1Width, col2Width], [
            'build',
            'Development build task'
        ])
    );
};