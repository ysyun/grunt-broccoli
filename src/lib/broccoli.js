import broccoli from 'broccoli';
import Watcher from 'broccoli/lib/watcher';
import findup from 'findup';
import copyDereference from 'copy-dereference';
import rimraf from 'rimraf';
import path from 'path';
import mkdirp from 'mkdirp';
import slowTrees from 'broccoli-slow-trees';
import liveReload from 'tiny-lr';
import cp from 'child_process';
let {join} = path;

const DEFAULT_LIVE_RELOAD_PORT = 35729;

class GruntBroccoli {
  constructor (grunt, plugin) {
    // Hang onto these
    this.grunt = grunt;
    this.plugin = plugin;

    // Alias options
    this.options = plugin.data;

    // Create builder
    let brocfilePath = findup.sync(process.cwd(), 'Brocfile.js');
    let tree = require(join(brocfilePath, 'Brocfile.js'));
    this.builder = new broccoli.Builder(tree);

    // Where to copy files after successful build
    this.dir = join(brocfilePath, this.options.dir);
  }

  setBroccoliEnv () {
    process.env.BROCCOLI_ENV = this.options.env || 'development';
  }

  build () {
    let done = this.plugin.async();
    this.setBroccoliEnv();

    this.grunt.log.ok('Building app for ' + process.env.BROCCOLI_ENV + '…');
    this.builder.build().then((hash) => {
      this.grunt.log.ok(`Built to "${this.dir}" successfully!`);
      slowTrees(hash.graph);
      this.syncHash(hash);
      done();
    }, function (error) {
      this.grunt.log.error('Build error:', error);
    });
  }

  syncHash (hash) {
    rimraf.sync(this.dir);
    mkdirp.sync(join(this.dir, '..'));
    copyDereference.sync(hash.directory, this.dir);
  }

  watch () {
    this.grunt.log.ok('Caching initial build…');
    this.plugin.async();
    this.setBroccoliEnv();

    let WatcherClass = this.options.watcherClass || Watcher;
    this.watcher = new WatcherClass(this.builder, this.options.watcherOptions || {});

    if (this.options.liveReload) {
      this.startLiveReloadServer();
    }

    if (this.options.nodeInspector) {
      this.startNodeInspectorServer();
    }

    this.initialBuild = true;
    this.watcher.once('build:complete', () => {
      this.initialBuild = false;
    });

    this.watcher.on('error', (err) => {
      this.grunt.log.error(err);
    });

    this.watcher.on('change', (hash) => {
      try {
        if (!this.initialBuild) {
          this.grunt.log.ok('Change detected, rebuilding…');
        }
        this.syncHash(hash);
        this.grunt.log.ok('Built successfully!');
        slowTrees(hash.graph);
        this.watcher.emit('build:complete');
      } catch (err) {
        this.grunt.log.error(err);
      }
    });

    if (this.options.serverScript) {
      this.bindWithServerScript();
    } else {
      this.bindWithoutServerScript();
    }
  }

  startLiveReloadServer () {
    this.grunt.log.ok('Starting live reload server…');
    let liveReloadPort = this.options.liveReloadPort || DEFAULT_LIVE_RELOAD_PORT;
    this.liveReloadServer = liveReload();
    this.liveReloadServer.server.on('listening', () => {
      let address = this.liveReloadServer.server.address();
      this.grunt.log.ok('Live reload server listening on ' + address.port);
    });
    this.liveReloadServer.listen(liveReloadPort);
  }

  startNodeInspectorServer () {
    let args = [require.resolve('node-inspector/bin/inspector')];
    let options = Object.keys(this.options.nodeInspectorOptions).map((option) => {
      let value = this.options.nodeInspectorOptions[option];

      if (option === 'hidden') {
        return [`--${option}`, JSON.stringify(value)].join(' ');
      } else {
        return [`--${option}`, value].join(' ');
      }
    }).join(' ').split(' ');

    args.push.apply(args, options);

    this.grunt.util.spawn({
      cmd: 'node',
      args: args,
      opts: {
        stdio: 'inherit'
      }
    }, (error) => {
      if (error) {
        this.grunt.fail.fatal(error);
      }
    });
  }

  startServer () {
    this.grunt.log.ok('Starting server…');
    this.server = cp.fork(this.options.serverScript);
    this.server.on('message', (data) => {
      if (data.event === 'listening') {
        let cwd = process.cwd();
        let serverScriptPath = path.resolve(this.options.serverScript);
        this.grunt.log.ok('Server `' + path.relative(cwd, serverScriptPath) + '` listening on port ' + data.port + '.');
        this.grunt.log.ok('Reloading browser…');
        this.triggerLiveReload();

        if (this.options.nodeInspector) {
          // Doesn't actually kill the server, just puts it into debug mode
          this.server.kill('SIGUSR1');
        }
      }
    });
  }

  killServer () {
    if (this.server.exitCode === null) {
      this.server.once('exit', () => this.startServer());
      this.server.kill();
    } else {
      this.startServer();
    }
  }

  triggerLiveReload () {
    if (this.liveReloadServer) {
      this.liveReloadServer.changed({
        body: {
          files: ['Broccoli build files']
        }
      });
    }
  }

  bindWithServerScript () {
    this.watcher.once('build:complete', () => {
      this.watcher.on('build:complete', () => this.killServer());
      this.startServer();
    });
  }

  bindWithoutServerScript () {
    this.watcher.on('build:complete', () => {
      this.triggerLiveReload();
    });
  }
}

module.exports = GruntBroccoli;
