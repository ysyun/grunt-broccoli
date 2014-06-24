var path = require('path');
var broccoli = require('broccoli');
var rimraf = require('rimraf');
var helpers = require('broccoli-kitchen-sink-helpers');
var Watcher = require('broccoli/lib/watcher');

var plugin = {
  builder: function(config) {
    var tree;
    if (typeof config === 'function') {
      tree = config();
    } else if (typeof config === 'string' || typeof config === 'undefined') {
      var configFile = config || 'Brocfile.js';
      var configPath = path.join(process.cwd(), configFile);
      try {
        tree = require(configPath);
      } catch(e) {
        // grunt.fatal("Unable to load Broccoli config file: " + e.message);
      }
    }
    return new broccoli.Builder(tree);
  },
  build: function(dest, config) {
    var builder = this.builder(config);
    return builder.build()
      .then(function(output) {
        rimraf(dest, function() {
          helpers.copyRecursivelySync(output.directory, dest);
          console.log('\n\nBuild successful\n');
        });
      });
  },
  serve: function(config, options) {
    var builder = this.builder(config);
    broccoli.server.serve(builder, { host: options.host, port: options.port });
  },
  watch: function(dest, config) {
    var builder = this.builder(config);
    var watcher = new Watcher(builder, { interval: 100 });
    return watcher.on('change', function(results) {
      console.log('\n\nChange detected');
      rimraf(dest, function() {
        helpers.copyRecursivelySync(results.directory, dest);
        console.log('Build successful\n');
      });
    });
  }
};

module.exports = plugin;
