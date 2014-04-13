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

      withConfig: {
        dest: 'tmp/tests/with_config',
        options: {
          config: './test/fixtures/Brocfile.js'
        }
      }

    }

  });

};