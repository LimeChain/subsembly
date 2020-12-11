const generateMetadata = require("./metadata");
const metadataToHex = require("./metadata/convert");

process.argv.forEach(arg => {
  if (arg === '-g'){
    generateMetadata();
  }
  else if(arg === '-h'){
    metadataToHex();
  }
})