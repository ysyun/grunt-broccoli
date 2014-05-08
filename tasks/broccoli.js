module.exports = function(grunt) {
  var broccoli = require('broccoli');
  var path = require('path');
  var rimraf = require('rimraf');
  var helpers = require('broccoli-kitchen-sink-helpers');
  var copyRecursivelySync = helpers.copyRecursivelySync;

  grunt.registerMultiTask('broccoli', 'Execute Custom Broccoli task', broccoliTask);

  function broccoliTask() {
    var config = this.data.config;
    process.env['BROCCOLI_ENV'] = this.data.env || 'development';
    var tree;

    if (typeof config === 'function') {
      tree = config();
    } else if (typeof config === 'string' || typeof config === 'undefined') {
      var configFile = config || 'Brocfile.js';
      var configPath = path.join(process.cwd(), configFile);
      try {
        tree = require(configPath);
      } catch(e) {
        grunt.fatal("Unable to load Broccoli config file: " + e.message);
      }
    }

    var command = this.args[0];

    if (command === 'build') {
      var dest = this.data.dest;

      if (!dest) {
        grunt.fatal('You must specify a destination folder, eg. `dest: "dist"`.');
      }
      var done = this.async();
      var builder = new broccoli.Builder(tree);
      builder.build()
        /**
         * As of Broccoli 0.10.0, build() returns { directory, graph }
         */
        .then(function(output) {
          // TODO: Don't delete files outside of cwd unless a flag is set.
          rimraf.sync(dest);
          copyRecursivelySync(output.directory, dest);
        })
        .then(done, function (err) {
          grunt.log.error(err);
        });
    } else if (command === 'serve') {
      var host = this.data.host || 'localhost';
      var port = this.data.port || 4200;

      var done = this.async();
      var builder = new broccoli.Builder(tree);
      broccoli.server.serve(builder, { host: host, port: port });
    } else {
      grunt.fatal('You must specify either the :build or :serve command after the target.');
    }

  }

};
