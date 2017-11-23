const chalk = require('chalk');

const pkg = require('../package.json');
const server = require('./server');
const path = require('path');

try {
  const projectConfig = require(process.env.configJson);
} catch (e) {
  console.log(chalk.red('项目缺少 abc.json 配置文件，启动失败'));
  process.exit(-1);
}

module.exports = {

  command: 'server',

  description: pkg.description,

  options: [
    [ '-p, --port <port>', '本地服务端口，默认 3000', 3000 ],
    [ '-o, --open', '使用默认浏览器访问页面' ],
    [ '-r, --reload', '开启livereload, 只在非webpack项目时生效', false ],
  ],

  action(options) {
    server.run(options);
  },
};