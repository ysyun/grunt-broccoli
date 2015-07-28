var esTranspiler = require('broccoli-babel-transpiler');

module.exports = esTranspiler('src', {
  stage: 0
});
