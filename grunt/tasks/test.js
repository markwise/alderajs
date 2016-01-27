module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('test:ph', [
        'clean:reports',
        'karma:ph'
    ]);
    
    grunt.registerTask('test:ch', [
        'clean:reports',
        'karma:ch'
    ]);
    
    grunt.registerTask('test:ff', [
        'clean:reports',
        'karma:ff'
    ]);
    
    grunt.registerTask('test:sa', [
        'clean:reports',
        'karma:sa'
    ]);
    
    grunt.registerTask('test:ie', [
        'clean:reports',
        'karma:ie'
    ]);
    
    grunt.registerTask('test:mac', [
        'clean:reports',
        'karma:mac'
    ]);
    
    grunt.registerTask('test:win', [
        'clean:reports',
        'karma:win'
    ]);
};