var grunt = require('grunt');
var spawn = require('child_process').spawn;

function runGruntTaskForTest(testName, mode, callback) {
  var taskName = 'broccoli:' + testName + ':' + mode;
  var child = spawn('grunt', [taskName]);
  child.on('close', callback);
}

exports.broccoliBuildTests = {
  withBrocfile: function(test) {
    test.expect(2);
    runGruntTaskForTest('with-brocfile', 'build', function() {
      var main1 = grunt.file.read('./tmp/tests/with-brocfile/main1');
      var main2 = grunt.file.read('./tmp/tests/with-brocfile/main2');
      test.equal(main1, "main1");
      test.equal(main2, "main2");
      test.done();
    });
  },
  withDefault: function(test) {
    test.expect(2);
    runGruntTaskForTest('with-default', 'build', function() {
      var main1 = grunt.file.read('./tmp/tests/with-default/main1');
      var main2 = grunt.file.read('./tmp/tests/with-default/main2');
      test.equal(main1, "main1");
      test.equal(main2, "main2");
      test.done();
    });
  },
  withFunction: function(test) {
    test.expect(2);
    runGruntTaskForTest('with-function', 'build', function() {
      var main1 = grunt.file.read('./tmp/tests/with-function/main1');
      var main2 = grunt.file.read('./tmp/tests/with-function/main2');
      test.equal(main1, "main1");
      test.equal(main2, "main2");
      test.done();
    });
  }
};
