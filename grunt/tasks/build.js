module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('build', [
        
        //Validate src files using JSHint
        'lint',
        
        //Remove existing files in build directory
        'clean:build',
        
        //Concatenate src files and output to build directory
        'concat',
        
        //Copy template adapters to build directory
        'copy:build',
        
        //Unit test build file (aldera.js) using Jasmine and PhantomJS
        'test:ph'
    ]);
};