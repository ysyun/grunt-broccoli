module.exports = function() {
  var mergeTrees = require('broccoli-merge-trees');
  var lib1 = './test/fixtures/lib1';
  var lib2 = './test/fixtures/lib2';
  return mergeTrees([lib1, lib2]);
};
