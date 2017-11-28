var currentPath = process.cwd();
var compile = require("../compile/compile.js");
var fs = require("fs");
var c = require('child_process');
var path = require('path');
const PZ = require('promzard').PromZard;
const chalk = require('chalk');
var def = require.resolve('./default-input.js');
var index = 0;
process.env.compileJson = path.join(process.argv[1].replace('\\bin\\angularcode',''), '/review/compile.json');
let setAlertError = function(name) {
	clearTimeout(name);
	return setTimeout(function() {
		console.log(chalk.red('项目中缺少abc.json配置文件'));
	}, 1000);
}
let alertError;
let dirIndex = 0;
let write = function(compilePath, oldJson) {
	fs.writeFile(compilePath, JSON.stringify(oldJson), function() {
		let server = require('../server/index');
		server.action({
			port: process.env.PORT,
			open: true,
			reload: false
		});
		c.exec(`start http://127.0.0.1:${process.env.PORT}/view/#/directiveModule/directiveModule`);
		c.exec(`open http://127.0.0.1:${process.env.PORT}/view/#/directiveModule/directiveModule`);
		console.log(chalk.green('open http://127.0.0.1:'+process.env.PORT+'/view/#/directiveModule/directiveModule'));
	});	
}
let isExistsFn = function(currentPath) {
    isNotHas = false;
	alertError = setAlertError(alertError);
	fs.exists(path.join(currentPath, '/abc.json'), function(exists) {  
		let isExists = exists ? true : false;
		index++;
		if(!isExists) {
			currentPath = path.join(currentPath , '../')
			dirIndex++;
			if(dirIndex < 10) {
				isExistsFn(currentPath);
			}				
		}
		else{
			clearTimeout(alertError);
			process.env.configJson = path.join(currentPath, '/abc.json');
            let viewModuleConfig = require(process.env.configJson);
            if(!(viewModuleConfig && viewModuleConfig.workspace &&  viewModuleConfig.workspace.view && viewModuleConfig.workspace.view.route)) {
                console.log(chalk.red('abc.json配置中有误，请修改配置文件后再试'));
			}
			let viewPath = viewModuleConfig.workspace.view.route.replace('/', '');
			let compilePath = currentPath +
				viewPath + '\\'
				+ (viewModuleConfig.workspace.view.branch || 'trunk')
				+ '\\compile.json';
            let newJson = new compile.ReplaceModule({
                projects: [process.cwd()],
                type: 'angularDirective',
				jsonPath: ''
			}).jsons;
			var compilePathA = path.join(compilePath, '');
			compilePathA = compilePathA.replace(/\\/g, '/');
			let oldJson = require(compilePathA);
			let oldObj = {};
			let newObj = {};
			oldJson.map(oldItem => {
				oldObj[oldItem.keyName] = oldItem;
			});
			newJson.map(newItem => {
				if(oldObj[newItem.keyName]) {
					var pz = new PZ(process.cwd()+'\.npm-init.js', {yes: true})
					pz.backupFile = def;
					pz.on('data', function (data) {
					  if(data.go === 'Y' || data.go === 'y') {
						oldJson.map((oldItem, index) => {
							if(oldItem.keyName === newItem.keyName) {
								oldJson.splice(index, 1, newItem);
							}
							oldObj[oldItem.keyName] = newItem;
						});
						write(compilePath, oldJson);
					  }					  
					});
				}
				else {
					oldJson.push(newItem);
					isNotHas = true;
				}
			})

			if(isNotHas) {
				write(compilePath, oldJson);
			}
					
		}
	});
}
isExistsFn(currentPath);

