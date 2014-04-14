var grunt = require('grunt');

exports.broccoliBuildTests = {
  withBrocfile: function(test) {
    test.expect(2);
    var main1 = grunt.file.read('./tmp/tests/with-brocfile/main1');
    var main2 = grunt.file.read('./tmp/tests/with-brocfile/main2');
    test.equal(main1, "main1");
    test.equal(main2, "main2");
    test.done();
  },
  withFunction: function(test) {
    test.expect(2);
    var main1 = grunt.file.read('./tmp/tests/with-function/main1');
    var main2 = grunt.file.read('./tmp/tests/with-function/main2');
    test.equal(main1, "main1");
    test.equal(main2, "main2");
    test.done();
  }
};