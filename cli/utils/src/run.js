const { generateMetadata, generateFile, generateDispatcher } = require('.');

run();
function run() {
  const metadata = generateMetadata();
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
  generateFile(metadata);
}