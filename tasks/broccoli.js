module.exports = function(grunt) {

  var _ = require('lodash');
  var broccoli = require('broccoli');
  var mergeTrees = require('broccoli-merge-trees');
  var findup = require('findup-sync');
  var RSVP = require('rsvp');
  var ncp = require('ncp');
  var path = require('path');

  // broccoli:build
  registerBroccoliCommandTask('build', 'Build Broccoli configuration');

  // broccoli:serve
  registerBroccoliCommandTask('serve', 'Serve Broccoli configuration');

  // broccoli:{customTaskName}[:(build,serve)]
  grunt.registerMultiTask('broccoli', 'Execute Custom Broccoli task', broccoliTask());

  function registerBroccoliCommandTask(command, description) {
    grunt.registerTask('broccoli:' + command , description, broccoliTask({
      command: command
    }));
  }

  function broccoliTask(defaults) {
    return function() {

      var _this = this, tree;

      var options = this.options(_.merge({
        config:  (this.data && this.data.config ? this.data.config : void 0) || findup('Brocfile.js', {nocase: true}),
        port: 4200,
        host: '127.0.0.1'
      }, defaults));

      // set options config from flags
      if (!options.command) {
        options.command = (this.flags.build?'build':void 0) || (this.flags.serve?'serve':void 0);
        if (!options.command) {
          grunt.log.error('You have to specify :build or :serve command after the task');
        }
      }

      function buildTree(config) {
        var tree;
        if (_.isString(config)) {
          if (!grunt.file.isPathAbsolute(config)) {
            config = path.normalize(path.join(process.cwd(), config));
          }
          try {
            tree = require(config)(broccoli);
          } catch (e) {
            grunt.fail.warn("Error occurred while trying to import broccoli config");
          }
          if (_.isUndefined(tree)) {
            grunt.verbose.error(config + " did not return a tree.");
          }
        } else if (_.isFunction(config)) {
          tree = config.apply(_this, [broccoli]);
        } else if (_.isArray(config)) {
          tree = _.filter(config.map(buildTree));
        } else {
          grunt.verbose.error("config has to be a string path, function or array of strings and/or functions");
        }

        return tree;
      }

      tree = buildTree(options.config);

      if (!tree) {
        grunt.log.writeln('Nothing done.');
        return;
      }

      if (_.isArray(tree)) {
        tree = mergeTrees(tree, { overwrite: true })
      }

      var builder = new broccoli.Builder(tree);

      var done = this.async();

      if (options.command === 'build') {

        builder.build()
          .then(function(dir){
            return RSVP.denodeify(ncp)(dir, (_this.data?_this.data.dest:void 0) || _this.args[0] || 'build', {
              clobber: true,
              stopOnErr: true
            });
          })
          .then(done, function (err) {
            grunt.log.error(err.message);
          });
      }

      if (options.command === 'serve') {
        broccoli.server.serve(builder, {
          port: options.port,
          host: options.host
        });
      }

    };
  }

};
