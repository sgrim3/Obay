module.exports = function (grunt){
  "use strict";

  grunt.initConfig({

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '3000'
          }
        }
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
            expand: true,
            cwd: "public/stylesheets/",
            src: ["**/*.scss"],
            dest: "public/stylesheets/",
            ext: ".css"
        }]
      }
    },

    watch: {
      app: {
        files: '**/*.scss',
        tasks: ["sass"]
      }
    }

  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch'); // Needs to be the last thing.
  
  grunt.registerTask('default', ['concurrent']);
};