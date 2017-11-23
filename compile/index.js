
var currentPath = process.cwd();
var compile = require("./compile.js");
var fs = require("fs");
var c = require('child_process');
var path = require('path');
const chalk = require('chalk');
var index = 0;
process.env.compileJson = path.join(process.argv[1].replace('\\bin\\angularcode',''), '/review/compile.json');
let isExistsFn = function(currentPath) {
	fs.exists(path.join(currentPath, '/abc.json'), function(exists) {  
		let isExists = exists ? true : false;
		index++;
		if(!isExists) {
			currentPath = path.join(currentPath , '../')
			isExistsFn(currentPath);	
		}
		else{
			process.env.configJson = path.join(currentPath, '/abc.json');
			let server = require('../server/index');
			server.action({
				port: process.env.PORT,
				open: true,
				reload: false
			});
			c.exec(`start http://127.0.0.1:${process.env.port}/view/#/compile/compile`);
			console.log(chalk.green('open http://127.0.0.1:${process.env.port}/view/#/compile/compile'));
		}
	});
}
isExistsFn(currentPath);

process.env.compileJsonData = JSON.stringify(new compile.ReplaceModule({
	projects: [currentPath],
	//branch: ['trunk'],
	type: 'angularDirective',
	jsonPath: ''
}).jsons);



