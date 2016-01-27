module.exports = function (grunt, width) {
    'use strict';
    
    var col1Width = 25;
    var col2Width = 80;

    grunt.log.writeln();
    grunt.log.writeln('test'['grey']);
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.wraptext(width, [
        'Runs unit tests in a given browser. An initial build file must be ',
        'generated before running tests using ' + 'grunt build'['cyan'] + '. A ',
        'code coverage report is generated for each browser in test/reports.'
    ].join('')));
    
    grunt.log.writeln();
    grunt.log.writeln('Options:'['grey']);
    grunt.log.writeln();
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:ph'['cyan'],  'PhantomJS']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:ch'['cyan'],  'Chrome']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:ff'['cyan'],  'Firefox']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:sa'['cyan'],  'Safari']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:ie'['cyan'],  'IE']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:mac'['cyan'], 'Mac browsers that include: Chrome, Firefox and Safari']));
    grunt.log.writeln(grunt.log.table([col1Width, col2Width], ['    grunt test:win'['cyan'], 'Win browsers that include: Chrome, Firefox and IE']));
};