module.exports = {
    options: {
        frameworks: ['jasmine'],
        singleRun: true,
        files: [
            '<%= paths.vendor %>/jquery/dist/jquery.js',
            '<%= paths.vendor %>/jasmine-jquery/lib/jasmine-jquery.js',
            '<%= paths.vendor %>/handlebars/handlebars.js',
            '<%= paths.test %>/init.js',
            '<%= paths.build %>/aldera.js',
            '<%= paths.build %>/adapters/aldera-handlebars.js',
            '<%= paths.test %>/apps/**/*.js',
            {pattern: '<%= paths.test %>/apps/**/*.html', watched: true, included: false},
            '<%= paths.specs %>/**/*.js'
        ],
        reporters: [
            'progress',
            'coverage'
        ],
        preprocessors: {
            'build/aldera.js': ['coverage']
        },
        coverageReporter: {
            type: 'html',
            dir: '<%= paths.reports %>',
            subdir: function (browser) {
                return browser.toLowerCase().split(/\s+/)[0];
            }
        }
    },

    ph: {browsers: ['PhantomJS']},
    ch: {browsers: ['Chrome']},
    ff: {browsers: ['Firefox']},
    sa: {browsers: ['Safari']},
    ie: {browsers: ['IE']},
    mac: {browsers: ['Chrome', 'Firefox', 'Safari']},
    win: {browsers: ['Chrome', 'Firefox', 'IE']}
};