var paths = {
    js: ['js/*.js', ],
    html: ['./*.html'],
    css: ['css/*.css']
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*\n' +
        ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
        ' *  <%= pkg.description %>\n' +
        ' *  <%= pkg.homepage %>\n\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  BSD License\n' +
        ' */'
    },
    watch: {
        js: {
            files: paths.js,
            options: {
                livereload: true
            }
        },
        html: {
            files: paths.html,
            options: {
                livereload: true
            }
        },
        css: {
            files: paths.css,
            options: {
                livereload: true
            }
        }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('min', ['uglify']);
  grunt.registerTask('server', ['connect']);

};