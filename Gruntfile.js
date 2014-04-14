module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadTasks('tasks');
  grunt.registerTask('test', ['clean', 'broccoli:*:build', 'nodeunit']);

  grunt.initConfig({
    clean: {
      tests: ['tmp']
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    broccoli: {
      'with-brocfile': {
        config: 'test/fixtures/with-brocfile.js',
        dest: 'tmp/tests/with-brocfile'
      },

      'with-function': {
        config: require('./test/fixtures/with-function.js'),
        dest: 'tmp/tests/with-function'
      }
    }

  });

};