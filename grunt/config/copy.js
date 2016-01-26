module.exports = {
    build: {
        files: [{
            expand: true,
            cwd:  '<%= paths.src %>',
            src:  'adapters/*',
            dest: '<%= paths.build %>'
        }]
    },
    dist: {
        files: [
            {
                src:  '<%= concat.main.dest %>',
                dest: '<%= paths.dist %>/<%= output %>.js'
            },
            {
                expand: true,
                cwd:  '<%= paths.build %>',
                src:  'adapters/*',
                dest: '<%= paths.dist %>'
            }
        ]
    }
};