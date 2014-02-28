module.exports = function(grunt) {

  grunt.initConfig({

    broccoli: {

      withFunction: {
        options: {
          // method bound to task
          config: brocFunction
        },
        src: 'examples',
        dest: 'output'
      },

      withRequire: {
        options: {
          config: require('./examples/Brocfile2')
        },
        src: 'examples',
        dest: 'output'
      },

      withArray: {
        options: {
          config: [ './examples/Brocfile.js', brocFunction, require('./examples/Brocfile2') ]
        },
        src: 'examples',
        dest: 'output'
      }

    }

  });

  function brocFunction(broccoli) {

    var tree = broccoli.makeTree(this.data.src);

    return tree;
  }

  require('./task')(grunt);

};