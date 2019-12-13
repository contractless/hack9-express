const fs = require('fs');
const path = require('path');
const scripts = fs.readdirSync(path.resolve(__dirname, './scripts'));
const runArtilleryTest = require('../artillery/runArtilleryTest.js');

runArtilleryTest.runTest(
  scripts,
  `loadTestConfig.yml`,
  `${__dirname}`
);
