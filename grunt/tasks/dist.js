module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('dist', [
        
        //Build aldera.js
        'build',
        
        //Remove existing files in dist directory
        'clean:dist',
    
        //Copy build files to dist directory
        'copy:dist',
        
        //Minify distribution and generate a source map file
        'uglify'
    ]);
};