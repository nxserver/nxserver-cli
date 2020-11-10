const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const FileService = require('../services/FileService');

const command = 'init';

const action = async () => {
  try {
    await FileService.checkDir();
  } catch (e) {
    console.log(chalk.red(e));
    const { reset } = await inquirer.prompt([
      {
        name: 'reset',
        message: 'Do you want to reinitialize?',
        type: 'list',
        choices: ['no', 'yes'],
      },
    ]);

    if (reset === 'yes') {
      await FileService.deleteDir();
    } else {
      return;
    }
  }

  // TODO: Load size and type from server and files in the dir.
  const { projectName, type, size } = await inquirer.prompt([
    {
      name: 'projectName',
      message: 'Enter the project name (chars a-zA-Z0-9_-):',
      type: 'string',
      default: path.basename(process.cwd()).replace(' ', /-/g),
      validate: (input) => {
        const regex = /^[a-zA-Z0-9_-]*$/g;
        return regex.exec(input) != null;
      },
    },
    {
      name: 'type',
      type: 'list',
      message: 'What type of application is this?',
      choices: ['nodejs.14-alpine', 'nodejs.12-alpine'],
    },
    {
      name: 'size',
      type: 'list',
      message: 'What size would you like to use?',
      choices: ['micro', 'small'],
    },
  ]);

  if (projectName === '') {
    console.log(chalk.red('Project name may not be empty!'));
    return;
  }

  await FileService.save(projectName, type, size);
};

module.exports = {
  command,
  action,
};
