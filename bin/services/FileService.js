const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir;
const archiver = require('archiver');
const chalk = require('chalk');

const folder = `${homedir()}/.nxs`;

class FileService {
  static save(projectName, type, size) {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${process.cwd()}/.nxs`, (errDir) => {
        if (errDir) {
          reject(errDir);
          return;
        }
        fs.writeFile(`${process.cwd()}/.nxs/project.json`, JSON.stringify({ projectName, type, size }), (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  static saveContainer(id, created, url) {
    fs.writeFile(`${process.cwd()}/.nxs/deployment.json`, JSON.stringify({ id, created, url }), (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
  }

  static readContainer() {
    return new Promise((resolve, reject) => {
      fs.readFile(`${process.cwd()}/.nxs/deployment.json`, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  static deleteContainer() {
    return new Promise((resolve, reject) => {
      fs.unlink(`${process.cwd()}/.nxs/deployment.json`, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static read() {
    return new Promise((resolve, reject) => {
      fs.readFile(`${process.cwd()}/.nxs/project.json`, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  static checkDir() {
    return new Promise((resolve, reject) => {
      fs.access(`${process.cwd()}/.nxs`, (err) => {
        if (err == null) {
          reject('Already initialized');
          return;
        }

        resolve();
      });
    });
  }

  static zipDir() {
    return new Promise((resolve, reject) => {
      const fileName = `${folder}/projects/temp_${path.basename(process.cwd())}.zip`;

      try {
        fs.unlinkSync(fileName);
      } catch (e) {}

      // create a file to stream archive data to.
      const output = fs.createWriteStream(fileName);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
      });

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', () => {
        resolve(fileName);
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          // log warning
          console.log(chalk.yellow(JSON.stringify(err, null, 2)));
        } else {
          // throw error
          reject(err);
        }
      });

      // good practice to catch this error explicitly
      archive.on('error', (err) => {
        reject(err);
      });

      // pipe archive data to the file
      archive.pipe(output);

      // append files from a sub-directory, putting its contents at the root of archive
      archive.directory(`${process.cwd()}/`, false);

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();
    });
  }

  static deleteDir() {
    return new Promise((resolve, reject) => {
      const localFolder = `${process.cwd()}/.nxs`;
      fs.rmdir(localFolder, { recursive: true }, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static saveAuth(authorizationToken, secretToken) {
    return new Promise((resolve, reject) => {
      FileService.checkConfigDir().then(() => {
        fs.writeFile(`${folder}/auth.json`, JSON.stringify({ authorizationToken, secretToken }), (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  static readAuth() {
    return new Promise((resolve, reject) => {
      fs.readFile(`${folder}/auth.json`, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  static checkConfigDir() {
    return new Promise((resolve, reject) => {
      fs.access(folder, (err) => {
        if (err == null) {
          resolve();
          return;
        }

        fs.mkdir(folder, (errDir) => {
          if (errDir) {
            reject(errDir);
            return;
          }
          fs.mkdir(`${folder}/projects`, (errDirTwo) => {
            if (errDirTwo) {
              reject(errDirTwo);
              return;
            }
            resolve();
          });
        });
      });
    });
  }
}

module.exports = FileService;
