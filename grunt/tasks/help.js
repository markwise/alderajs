//
// Display task help.
//
// Help files are located in grunt/docs and have a .doc.js extension. Doc files
// MUST export a function that can later be called when requesting help for a
// specific task.
//
// A base doc file would be the following:
//
//      module.exports = function (grunt, width) {
//          //log something
//      };
//
// The parameters grunt and width are passed to every doc function. Grunt is a
// reference to grunt and width is what column text will wrap at. The default
// width is 80 and is used with grunt.log.wraptext.
//
// All output should be handled using grunt logging methods. Documentation is
// located at http://gruntjs.com/api/grunt.log.
//

module.exports = function (grunt) {
    'use strict';

    var path = require('path'),
        docs = {};

    //Dynamically load doc files
    grunt.file.recurse('grunt/docs', function (abspath, rootdir, subdir, filename) {
        subdir || (subdir = '');

        var match = filename.match(/(.*)\.doc\.js$/);

        if (match) {
            docs[match[1]] = require(path.join('../docs', subdir, filename));
        }
    });

    grunt.registerTask('help', function (task) {
        var fn = docs[task || 'help'];

        if (!fn) {
            grunt.log.writeln();
            grunt.log.writeln('Task ' + task['cyan'] + ' has no help docs or is not a valid task.');
            grunt.log.writeln();
            grunt.log.writeln('Use ' + 'grunt'['cyan'] + ' or ' + 'grunt help'['cyan'] + ' to view tasks.');
            return;
        }

        fn(grunt, 80);
    });
};