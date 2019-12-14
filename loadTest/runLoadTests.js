const fs = require('fs');
const path = require('path');
const scripts = fs.readdirSync(path.resolve(__dirname, './scripts'));
const scriptArg = [process.argv && process.argv[2].split("=")[1]];

const runArtilleryTest = require('./runArtilleryTest.js');

runArtilleryTest.runTest(
  scriptArg || scripts,
  `loadTestConfig.yml`,
  `${__dirname}`
);
