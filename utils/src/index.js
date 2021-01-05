const { generateMetadata, generateFile } = require("./metadata");
const fs = require('fs');
const path = require("path");

run();
function run() {
  const metadata = generateMetadata();
  let debug = false;
  process.argv.forEach(arg => {
    if (arg === '--debug' || arg === '-d') {
      debug = true;
    }
  });
  if(debug){
    fs.writeFileSync(path.join(__dirname, "../metadata.json"), JSON.stringify(metadata, null, 4));
    return ;
  };
  generateFile(metadata);
}
