const chalk = require('chalk');
const inquirer = require('inquirer');
const FileService = require('../services/FileService');
const ApiService = require('../services/ApiService');

const command = 'remove';

const action = async () => {
  const { reset } = await inquirer.prompt([
    {
      name: 'reset',
      message: 'Are you sure that you want to remove your application? It will not be online afterwards.',
      type: 'list',
      choices: ['no', 'yes'],
    },
  ]);

  if (reset === 'no') {
    return;
  }

  try {
    const { id } = await FileService.readContainer();
    const body = await ApiService.deleteContainer(id);
    await FileService.deleteContainer();
    console.log(chalk.bold('The application is being removed. Check the status with "nx status"'));
  } catch (e) {
    console.log(chalk.red.bold(`Status code: ${e.response.statusCode}`));
    console.log(chalk.red('Not deployed yet. First need to run "nx deploy" before you can delete it'));
    return;
  }
};

module.exports = {
  command,
  action,
};
