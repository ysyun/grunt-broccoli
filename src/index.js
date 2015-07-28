import GruntBroccoli from './lib/broccoli';

module.exports = (grunt) => {
  grunt.registerMultiTask('broccoli', 'Broccoli build/watch/server task', function () {
    let command = this.args[0] || 'watch';
    let instance = new GruntBroccoli(grunt, this);

    // Kick off
    if (command === 'watch') {
      instance.watch();
    } else if (command === 'build') {
      instance.build();
    } else {
      grunt.fatal(`Invalid command "${this.command}" passed to grunt-broccoli. Should be either "watch" or "build".`);
    }
  });
};
