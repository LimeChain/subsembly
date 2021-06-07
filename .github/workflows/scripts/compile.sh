sudo npm install -g yarn
yarn install
npm run build
node ./cli/dist/src/index.js spec --to=./chain-spec.json
node ./cli/dist/src/index.js spec --src=./chain-spec.json
sudo npm uninstall -g yarn