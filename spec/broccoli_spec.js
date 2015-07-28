var GruntBroccoli = require('../tasks/lib/broccoli');
var grunt = require('grunt');
var join = require('path').join;
var touch = require('touch');

describe('GruntBroccoli', function () {
  var appPath = join(__dirname, 'fixtures/app');
  var cwd = process.cwd();

  beforeEach(function () {
    process.chdir(appPath);
  });

  afterEach(function () {
    process.chdir(cwd);
  });

  describe('#setBroccoliEnv', function () {
    it('Sets `env` correctly', function () {
      var plugin = {
        data: {
          dir: 'foo',
          env: 'production'
        }
      };
      var instance = new GruntBroccoli(grunt, plugin);
      instance.setBroccoliEnv();
      expect(process.env.BROCCOLI_ENV).toEqual('production');

      plugin.data.env = 'development';
      instance = new GruntBroccoli(grunt, plugin);
      instance.setBroccoliEnv();
      expect(process.env.BROCCOLI_ENV).toEqual('development');
    });
  });

  describe('#build', function () {
    it('Builds the app to the specified directory', function (done) {
      var plugin = {
        async: function () {
          return assertions;
        },
        data: {
          dir: '../output/build_test'
        }
      };
      var instance = new GruntBroccoli(grunt, plugin);
      instance.build();

      function assertions () {
        var file = grunt.file.read(join(appPath, '../output/build_test/index.js'));
        expect(file).toContain('Do it for the Vine!');
        done();
      }
    });
  });

  describe('#watch', function () {
    it('rebuilds the app when files change', function (done) {
      var plugin = {
        async: function () {},
        data: {
          dir: '../output/watch_test'
        }
      };
      var instance = new GruntBroccoli(grunt, plugin);
      instance.watch();
      instance.watcher.once('build:complete', cacheAssertions);

      function cacheAssertions () {
        var file = grunt.file.read(join(appPath, '../output/watch_test/index.js'));
        expect(file).toContain('Do it for the Vine!');
        instance.watcher.once('build:complete', rebuildAssertions);
        touch.sync(join(appPath, 'src/index.js'));
      }

      function rebuildAssertions () {
        var file = grunt.file.read(join(appPath, '../output/watch_test/index.js'));
        expect(file).toContain('Do it for the Vine!');
        done();
      }
    });

    it('Starts a live reload server and triggers reload when files change', function (done) {
      var plugin = {
        async: function () {},
        data: {
          dir: '../output/watch2_test',
          liveReload: true
        }
      };
      var instance = new GruntBroccoli(grunt, plugin);
      instance.watch();
      expect(instance.liveReloadServer).toBeTruthy();
      spyOn(instance.liveReloadServer, 'changed');
      instance.watcher.once('build:complete', function () {
        expect(instance.liveReloadServer.changed).toHaveBeenCalled();
        done();
      });
      touch.sync(join(appPath, 'src/index2.js'));
    });

    it('Handles starting and restarting a server script when files change', function (done) {
      var plugin = {
        async: function () {},
        data: {
          dir: '../output/watch3_test',
          serverScript: 'server.js'
        }
      };
      var instance = new GruntBroccoli(grunt, plugin);
      instance.watch();
      spyOn(instance, 'startServer').and.callThrough();
      instance.watcher.once('build:complete', cacheAssertions);

      function cacheAssertions () {
        expect(instance.startServer).toHaveBeenCalled();
        spyOn(instance, 'killServer').and.callThrough();
        instance.server.on('message', function () {
          instance.watcher.once('build:complete', rebuildAssertions);
          touch.sync(join(appPath, 'src/index3.js'));
        });
      }

      function rebuildAssertions () {
        expect(instance.killServer).toHaveBeenCalled();
        done();
      }
    });
  });
});
