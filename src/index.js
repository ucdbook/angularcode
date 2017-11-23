const chalk = require('chalk');
console.log(chalk.red('What do you want to do?'));
console.log(chalk.green('-r'), chalk.red(' --review  current component in the demo;'));
console.log(chalk.green('      '), chalk.red(' example: angularcode review 3001, default port is 3333'));
console.log(chalk.green('-p  '), chalk.red(' --push  current component to the demo web;'));