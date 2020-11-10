const chalk = require('chalk');
const FileService = require('../services/FileService');
const ApiService = require('../services/ApiService');

const command = 'deploy';

const action = async () => {
  let projectName, type, size;

  try {
    const data = await FileService.read();
    projectName = data.projectName;
    type = data.type;
    size = data.size;
  } catch (e) {
    console.log(chalk.red('Not initialized. Please init your project first with "nx init"'));
    return;
  }

  console.log('Zipping project...');

  const zipPath = await FileService.zipDir();

  let body;

  try {
    try {
      const { id } = await FileService.readContainer();

      console.log('Redeploying project...');
      body = await ApiService.updateContainer(id, projectName, type, size, zipPath);
    } catch (e) {
      console.log('Deploying project...');
      body = await ApiService.createContainer(projectName, type, size, zipPath);
    }
    // await FileService.saveContainer(body.id, body.created, body.url);
    await FileService.saveContainer(body.id, body.created, body.url);

    console.log(chalk.bold('Done. You application is being rolled out and will be available shortly at:'));
    console.log(chalk.green(chalk.bold('URL: ') + chalk.underline(`http://${body.url}`)));
    console.log(chalk.bold(`Check the deployment status with "nx status"`));
  } catch (e) {
    console.log(chalk.red('Failed to deploy application:'));
    console.log(chalk.red(e));
  }
};

module.exports = {
  command,
  action,
};
