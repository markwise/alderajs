module.exports = {
    build: {
        files: [{
            expand: true,
            cwd:  '<%= paths.src %>',
            src:  'adapters/*',
            dest: '<%= paths.build %>'
        }]
    }
};