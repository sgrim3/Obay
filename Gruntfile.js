module.exports = function (grunt){
  "use strict";

  grunt.initConfig({

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    includeSource: {
      options: {
        basePath: 'public/',
        // baseUrl: 'public/'
      },
      templates: {
        html: {
          js: '<script src="{filePath}"></script>'
        },
      },
      myTarget: {
        files: {
          'public/index.html': 'public/index.tpl.html'
        }
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '3000'
          },
          ignore: ['node_modules/**', 'public/'],
        }
      }
    },

    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: [{
            expand: true,
            cwd: "public/stylesheets/scss",
            src: "main.scss",
            dest: "public/stylesheets/css",
            ext: ".css"
        }],
      }
    },

    watch: {
      sass: {
        files: '**/*.scss',
        tasks: ["sass"]
      },
      client:{
        files: 'public/**/*',
        options:{
          livereload:true,
        },
      },


      // viewFiles: {
      //   files: ['**/*.js', 'public/index.tpl.html'],
      //   tasks: ["includeSource"]  
      // }
    }
  });

  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch'); // Needs to be the last thing.
  
  grunt.registerTask('default', ['concurrent']);
};