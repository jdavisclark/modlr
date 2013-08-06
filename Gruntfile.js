'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    bgShell: {
      browserify: {
        cmd: "mkdir -p build && browserify -s modlr -e modlr.js -o build/modlr.pack.js"
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['nodeunit']);

  grunt.loadNpmTasks("grunt-bg-shell");
};
