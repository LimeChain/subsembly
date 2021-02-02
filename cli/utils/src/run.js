const fs = require('fs');
const path = require("path");
const generateMetadata = require('./metadata/metadata-json');
const generateFile = require('./metadata/metadata-ts');
const generateDispatcher = require('./dispatcher/index');

run();
function run() {
  const metadata = generateMetadata();
  let debug = false;
  let dispatcher = false;
  process.argv.forEach(arg => {
    if (arg === '--debug' || arg === '-d') {
      debug = true;
    }
    else if (arg === '--dispatcher' || arg === '-t') {
      dispatcher = true;
    }
  });
  if(debug){
    fs.writeFileSync(path.join(__dirname, "../metadata.json"), JSON.stringify(metadata, null, 4));
    return ;
  }
  else if(dispatcher) {
    generateDispatcher(metadata);
  }
  generateFile(metadata);
}