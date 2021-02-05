const generateMetadata = require('./metadata/metadata-json');
const generateFile = require('./metadata/metadata-ts');
const generateDispatcher = require('./dispatcher/index');

module.exports = {
  generateDispatcher, generateFile, generateMetadata
};
