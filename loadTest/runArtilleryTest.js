const exec = require('child_process').exec;

async function runLoadTest(scripts, configName, directory) {
  this.configName = configName;
  this.directory = directory;
  return Promise.all(scripts.map(script => executeCommand(script)));
}

function executeCommand(script) {
  return new Promise((resolve, reject) => {
    let fileName = script.split('.')[0];
    let command = `artillery run \
    -e DEV \
    --config ${this.directory}/${this.configName} \
    -o ${this.directory}/reports/${fileName}.json ${this.directory}/scripts/${script} \
    && artillery report ${this.directory}/reports/${fileName}.json`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject();
        return;
      }
      resolve();
    });
  });
}

async function runTest(scripts, configName, directory) {
  try {
    await runLoadTest(scripts, configName, directory);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
module.exports = {
  runTest
};
