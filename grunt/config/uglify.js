module.exports = {
    dist: {
        options: {
            banner: '<%= banner %>',
            sourceMap: true
        },
        files: {
            '<%= paths.dist %>/<%= output %>.min.js': ['<%= concat.main.dest %>']
        }
    }
};