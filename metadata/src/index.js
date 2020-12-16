const { generateMetadata, generateFile } = require("./metadata");
const fs = require('fs');

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
    fs.writeFileSync("./metadata.json", JSON.stringify(metadata, null, 4));
    return ;
  };
  generateFile(metadata);
}
