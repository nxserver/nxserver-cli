const chalk = require('chalk');
const FileService = require('../services/FileService');
const ApiService = require('../services/ApiService');
const PrintService = require('../services/PrintService');

const command = 'status';

const action = async () => {
  try {
    const { id } = await FileService.readContainer();
    const { container } = await ApiService.getContainer(id);

    PrintService.containers([container]);
  } catch (e) {
    console.log(chalk.red.bold(`Status code: ${e.response.statusCode}`));
    console.log(chalk.red('Not deployed yet. First need to run "nx deploy" before you can check its status.'));
    return;
  }
};

module.exports = {
  command,
  action,
};
