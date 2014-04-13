var grunt = require('grunt');

exports.broccoli_build_test = {
  with_config: function(test) {
    test.expect(2);
    var main1 = grunt.file.read('./tmp/tests/with_config/main1');
    var main2 = grunt.file.read('./tmp/tests/with_config/main2');
    test.equal(main1, "main1");
    test.equal(main2, "main2");
    test.done();
  }
};