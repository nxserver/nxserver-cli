const chalk = require('chalk');
const inquirer = require('inquirer');
const FileService = require('../services/FileService');

const command = 'config';

const action = async () => {
  const { authorizationToken, secretToken } = await inquirer.prompt([
    {
      name: 'authorizationToken',
      message: 'Enter authorization token:',
      type: 'string',
    },
    {
      name: 'secretToken',
      message: 'Enter secret token:',
      type: 'password',
    },
  ]);

  if (authorizationToken === '' || secretToken === '') {
    console.log(chalk.red('Neither token is allowed to be empty'));
    return;
  }

  await FileService.saveAuth(authorizationToken, secretToken);
  console.log('Configuration updated');
};

module.exports = {
  command,
  action,
};
