const chalk = require('chalk');
const ApiService = require('../services/ApiService');
const PrintService = require('../services/PrintService');

const command = 'list';

const action = async () => {
  try {
    const { containers } = await ApiService.getContainers();

    PrintService.containers(containers);
  } catch (e) {
    console.log(e);
    console.log(chalk.red('Not deployed yet. First need to run "nx deploy" before you can check its status.'));
    return;
  }
};

module.exports = {
  command,
  action,
};
