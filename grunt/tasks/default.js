//
// The default grunt task outputs basic usage info. The following commands are
// equivalent and have the same output.
//
//      grunt
//      grunt help
//      grunt help:help
//

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('default', function () {
        require('../docs/help.doc')(grunt);
    });
};