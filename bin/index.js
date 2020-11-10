#!/usr/bin/env node

const { Command } = require('commander');

const commands = require('./commands');

let program = new Command();
program.version('0.0.1');

for (const commandOpt of commands) {
  program.command(commandOpt.command).action(commandOpt.action);
}

program.parse(process.argv);
