const fs = require('fs');
const dotenv = require('dotenv');
const FormData = require('form-data');
const got = require('got');
const inquirer = require('inquirer');
const FileService = require('./FileService');

const baseUrl = 'http://localhost:3000';

class ApiService {
  static async createContainer(projectName, type, size, zipPath) {
    // Read .env file if exists
    const result = dotenv.config();

    let port = result.parsed.PORT;

    if (result.error || port == null) {
      if (result.error) console.log('No .env file found.');
      else console.log('"PORT" configuration not found in .env file');
      const returned = await inquirer.prompt([
        {
          name: 'port',
          message: 'Please enter your port on while your application is listening on:',
          type: 'number',
          default: 80,
        },
      ]);

      port = returned.port;

      if (port <= 0 || port > 65535) {
        console.log(chalk.red('Invalid port. Must be between 1 - 65535'));
        return;
      }
    }

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('type', type);
    formData.append('size', size);
    formData.append('extraData', JSON.stringify({ port }));
    formData.append('file', fs.createReadStream(zipPath));

    const auth = await ApiService.getHeaders();

    const response = await got.post(`${baseUrl}/cli/containers`, {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...auth,
        ...formData.getHeaders(),
      },
    });

    return JSON.parse(response.body);
  }

  static async updateContainer(id, projectName, type, size, zipPath) {
    // Read .env file if exists
    const result = dotenv.config();

    let port = result.parsed.PORT;

    if (result.error || port == null) {
      if (result.error) console.log('No .env file found.');
      else console.log('"PORT" configuration not found in .env file');
      const returned = await inquirer.prompt([
        {
          name: 'port',
          message: 'Please enter your port on while your application is listening on:',
          type: 'number',
          default: 80,
        },
      ]);

      port = returned.port;

      if (port <= 0 || port > 65535) {
        console.log(chalk.red('Invalid port. Must be between 1 - 65535'));
        return;
      }
    }

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('type', type);
    formData.append('size', size);
    formData.append('extraData', JSON.stringify({ port }));
    formData.append('file', fs.createReadStream(zipPath));

    const auth = await ApiService.getHeaders();

    const response = await got.patch(`${baseUrl}/cli/containers/${id}`, {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...auth,
        ...formData.getHeaders(),
      },
    });

    return JSON.parse(response.body);
  }

  static async getContainer(id) {
    const auth = await ApiService.getHeaders();

    const response = await got.get(`${baseUrl}/cli/containers/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth,
      },
    });

    return JSON.parse(response.body);
  }

  static async getContainers() {
    const auth = await ApiService.getHeaders();

    const response = await got.get(`${baseUrl}/cli/containers`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth,
      },
    });

    return JSON.parse(response.body);
  }

  static async deleteContainer(id) {
    const auth = await ApiService.getHeaders();

    const response = await got.delete(`${baseUrl}/cli/containers/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth,
      },
    });

    return JSON.parse(response.body);
  }

  static async getHeaders() {
    try {
      const { authorizationToken, secretToken } = await FileService.readAuth();

      return { Authorization: `${authorizationToken}.${secretToken}` };
    } catch (e) {
      throw new Error('Not configured. Please configure first with "nx config"');
    }
  }
}

module.exports = ApiService;
