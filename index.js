console.log(11111);
var isReView = process.argv[2] === 'review';
let requireModule;

process.env.PORT = process.argv[3];
if(process.env.PORT === parseInt(process.env.PORT, 10) + '' && (process.env.PORT + '').length === 4) {}
else {
  process.env.PORT = 3333;
}
switch(process.argv[2]) {
    case 'review':
    requireModule = require('./compile/index')
    break;
    case 'push':
    requireModule = require('./push/index');
    break;
    default:
    requireModule = require('./src/index');
    break;
}
module.exports = requireModule;