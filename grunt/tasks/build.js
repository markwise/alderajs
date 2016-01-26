module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('build', function () {

        if (arguments.length) {
            grunt.log.writeln();
            grunt.log.writeln('This task has no options.');
            return;
        }

        grunt.task.run([
        
            //Validate src files using JSHint
            'lint',
            
            //Remove existing files in build directory
            'clean:build',
            
            //Concatenate src files and output to build directory
            'concat',
            
            //Copy additional files to build directory (template adapters)
            'copy:build'
        ]);
    });
};