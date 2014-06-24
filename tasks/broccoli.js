module.exports = function(grunt) {
  var path = require('path');
  var plugin = require(path.join(__dirname, '..', 'lib', 'plugin'));

  grunt.registerMultiTask('broccoli', 'Execute Custom Broccoli task', broccoliTask);

  function broccoliTask() {
    process.env.BROCCOLI_ENV = this.data.env || 'development';

    var command = this.args[0],
      dest = this.data.dest,
      config = this.data.config;

    if (command === 'build') {
      if (!dest) {
        grunt.fatal('You must specify a destination folder, eg. `dest: "dist"`.');
      }
      var done = this.async();
      plugin.build(config).then(done, function(err) {
        grunt.log.error(err);
      });
    } else if(command === 'watch') {
      if (!dest) {
        grunt.fatal('You must specify a destination folder, eg. `dest: "dist"`.');
      }
      if(this.data.background) {
        var backgroundProcess = grunt.util.spawn({
          cmd: process.argv[0],
          args: [
            path.join(__dirname, '..', 'lib', 'background.js'),
            dest
          ]
        }, function() { });
        backgroundProcess.stdout.pipe(process.stdout);
        backgroundProcess.stderr.pipe(process.stderr);
        process.on('exit', function () {
          backgroundProcess.kill();
        });
      } else {
        plugin.watch(dest, config).on('error', function(error) {
          grunt.fatal('\n\nBuild failed.\n' + error.stack);
        });
      }
      this.async();
    } else if(command === 'serve') {
      var host = this.data.host || 'localhost';
      var port = this.data.port || 4200;
      var liveReloadPort = this.data.liveReloadPort || 35729;

      plugin.serve(config, { host: host, port: port, liveReloadPort: liveReloadPort });
      this.async();
    } else {
      grunt.fatal('You must specify either the :build, :watch or :serve command after the target.');
    }
  }
};
