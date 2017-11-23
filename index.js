var program = require('commander');
const path = require('path');
const pgk = require('./package.json');

// dirs to find plugins
program
.version(pgk.version)
.option('-r, --review', 'review current component in the demo;')
.option('-p, --push', 'push current component to the demo web;')
.parse(process.argv);


var isReView = process.argv[2] === 'review';
let requireModule;

process.env.PORT = process.argv[3];
if(process.env.PORT === parseInt(process.env.PORT, 10) + '' && (process.env.PORT + '').length === 4) {}
else {
  process.env.PORT = 3333;
}
switch(process.argv[2]) {
    case '-r' || '--review':
    requireModule = require('./compile')
    break;
    case '-p' || '--push':
    requireModule = require('./push');
    break;
    default:
    requireModule = require('./src/index');
    break;
}
module.exports = requireModule;