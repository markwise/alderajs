module.exports = function (grunt) {
    return {
        scripts: {
            options: {
                separator: '\n\n\n',
                process: function (src, path) {
            
                    //Remove use strict statements
                    src = src.replace(/^[\t ]+(['"])use strict\1;\s*/mg, '    ');
                    
                    //Indent each line by 4 spaces
                    src = src.replace(/^(.*)$/mg, '    $1');
            
                    return src;
                }
            },
            src: [
                '<%= paths.src %>/createViewElement.js',
                '<%= paths.src %>/initialize.js',
                '<%= paths.src %>/view.js',
                '<%= paths.src %>/createNamedFn.js',
                '<%= paths.src %>/createViewConstructor.js',
                '<%= paths.src %>/viewType.js',
                '<%= paths.src %>/store.js',
                '<%= paths.src %>/data.js',
                '<%= paths.src %>/app.js'
            ],
            dest: '<%= paths.build %>/<%= pkg.name %>.js'
        },
        
        main: {
            options: {
                banner: '<%= banner %>\n',
                process: function (src, path) {
                
                    //Insert concatenated scripts into main module
                    src = src.replace(/[ \t]*\/\/[ \t]*@scripts/, grunt.file.read('build/aldera.js'));
                    
                    //Add package.json version
                    src = src.replace(/@version/, grunt.config.data.pkg.version);
                
                    return src;
                }
            },
            src: ['<%= paths.src %>/main.js'],
            dest: '<%= concat.scripts.dest %>'
        }
    };
};