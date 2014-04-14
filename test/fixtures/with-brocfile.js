var mergeTrees = require('broccoli-merge-trees');
var lib1 = './test/fixtures/lib1';
var lib2 = './test/fixtures/lib2';
module.exports = mergeTrees([lib1, lib2]);
