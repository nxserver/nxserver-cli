const chalk = require('chalk');
const columnify = require('columnify');

class PrintService {
  static containers(containers, all = false) {
    const data = [];

    for (const container of containers) {
      const priceString = `${container.size.price}`;
      const price =
        priceString.slice(0, priceString.length - 2) +
        '.' +
        `${container.size.price}`.slice(priceString.length - 2) +
        '€';
      data.push({
        name: container.projectName,
        state: container.state === 'running' ? chalk.green(container.state) : container.state,
        url: chalk.underline(`http://${container.url}`),
        type: container.type,
        lastUpdated: container.updated,
        size: container.size.name,
        cost: price,
      });
    }

    let columns;

    if (all) {
      columns = columnify(data, {
        columns: ['name', 'state', 'url', 'type', 'lastUpdated', 'size', 'cost'],
      });
    } else {
      columns = columnify(data, {
        columns: ['name', 'state', 'url', 'size'],
      });
    }

    console.log(columns);
  }
}

module.exports = PrintService;
