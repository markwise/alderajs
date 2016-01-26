module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('dist', function () {

        if (arguments.length) {
            grunt.log.writeln();
            grunt.log.writeln('This task has no options.');
            return;
        }

        grunt.task.run([
        
            //Run build task
            'build',
            
            //Remove existing files in distribution directory
            'clean:dist',
        
            //Copy build files to distribution directory
            'copy:dist',
            
            //Minify distribution
            'uglify'
        ]);
    });
};