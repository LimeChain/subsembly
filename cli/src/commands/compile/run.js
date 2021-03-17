const fs = require('fs');
const { generateMetadata, generateFile, generateDispatcher } = require('.');

run();
function run() {
  const metadata = generateMetadata();
  fs.writeFileSync("./metadata.json", JSON.stringify(metadata, 0, 4));
  let dispatcher = false;
  process.argv.forEach(arg => {
    if (arg === '--dispatcher' || arg === '-t') {
      dispatcher = true;
    }
  });
  if(dispatcher) {
    generateDispatcher(metadata);
    return ;
  }
  // generateFile(metadata);
}