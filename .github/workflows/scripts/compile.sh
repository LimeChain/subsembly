npm install -g yarn
npm run build
node ./cli/dist/src/index.js spec --to=./spec-files/chain-spec.json
node ./cli/dist/src/index.js spec --src=./spec-files/chain-spec.json
npm uninstall -g yarn