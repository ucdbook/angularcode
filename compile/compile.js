var fs = require("fs");
var ReplaceModule = function(options, callback) {
	this.fs = fs;
	this.jsonPath = options.jsonPath;
	this.type = options.type;
	//this.branch = options.branch || [];
	this.jsons = [];
	this.data = {};
	var _this = this;

	this.each(options.projects, function(index, path) {
		_this.readDirs(path + '/');
	});
	
	this.callback = callback || function() {};
	//this.writeJson();
	
}
ReplaceModule.prototype = {
	each: function(data, callback) {
		var i, k;
		for(i = 0, k = data.length; i < k; i++) {
			callback.call(this, i, data[i]);
		}
	},
	
	readDirs: function(dirName) {
		var _this = this;
		var dirs = this.fs.readdirSync(dirName);
		_this.each(dirs, function(i) {
			var newDirName = dirName + '/' + dirs[i]
			var stat = _this.fs.lstatSync(newDirName);
			//var isBranch = false;
			//_this.each(this.branch, function(i, item) {
			//	if(newDirName.indexOf('/'+item+'/') >= 0) {
			//		isBranch = true;
			//	}
			//});

			if (stat.isDirectory() && this.type !== 'doc') {
				_this.readDirs(newDirName);
			}
			else {
				_this.writeFile(dirName, newDirName, i);
			}
		});
	},
	
	writeFile: function(dirName, fileName, i) {
		fileName = fileName.replace(/\/+/g, '/');
		if(this.type === 'doc') {
			if(fileName.match(/\.html$/)) {
				var fileNames = fileName.split('/');
				fileName = fileNames[fileNames.length - 1];
				var text = this.fs.readFileSync(dirName, "utf-8");
				text = text.match(/\<title\>(\w|\s|[\u2E80-\u9FFF])*\<\/title\>/g);
				text = text[0].replace('</title>', '');
				text = text.replace('<title>', '');
				this.jsons.push({
					name: text,
					href: '/ehuodi/libs/doc/' + fileName
				});
			}
		}
		else if(this.type === 'angularDirective') {
			var text = this.fs.readFileSync(fileName, "utf-8");
			var item = this.angularDirectiveDoc(text, fileName);
			if(item) {
				//console.log('构建成功：',item.name)
				this.jsons.push(item);
			}			
		}
		else {
			if(fileName.match(/package\.json$/)) {
				var text = this.fs.readFileSync(fileName, "utf-8");
				var textJson = JSON.parse(text);
				if(textJson.type.indexOf(this.type) >= 0) {
					this.data[textJson.tag] = this.data[textJson.tag] || {};
					this.data[textJson.tag].name = textJson.tag;
					this.data[textJson.tag].list = this.data[textJson.tag].list || [];
					this.data[textJson.tag].list.push(textJson);
				}
			}
		}		
	},

	writeJson: function() {
		var path = this.jsonPath;
		var key, _this = this;
		if(this.type !== 'doc') {
			for(key in this.data) {
				this.jsons.push(this.data[key]);
			}
		}
		
		var text = JSON.stringify(this.jsons);
		if(path) {
			this.fs.writeFile(path, text, function() {
				_this.jsonsLength = _this.jsons.length;
				console.log('success:', path);
			});
		}
		return text;
	},

	angularDirectiveDoc: function(text, fileName) {
		if(text.match(/\*\s*\<directive\>/g) && fileName.indexOf('.js') > 0 && fileName.indexOf('min.js') < 0) {
			var data = {};
			var scope = [];
			//获取name
			var name = text.match(/app.directive\((\'|\")\w+(\'|\")\,/);
			name = name[0].match(/(\'|\")\w+(\'|\")/);
			name = name[0].replace(/(\'|\")/g, '');
			data.keyName = name;
			data.name = this.getLineValue('@name', text)[0] || name;
			data.author = this.getLineValue('@author', text)[0];
			data.lastBy = this.getLineValue('@lastBy', text)[0];
			data.description = this.getLineValue('@description', text)[0];
			data.date = this.getLineValue('@date', text)[0];
			data.scope = this.getScopeArray('@scope', text, fileName);
			data.attrs = this.getScopeArray('@attrs', text, fileName);
			data.deps = [this.getDeps(fileName)];
			data.html = this.getLineValue('@html', text, fileName)[0];
			data.api = this.getLineValue('@api', text);
			data.htmlUrl = this.getLineValue('@htmlUrl', text) || '';
			return data;
		}
	},
	
	getDeps: function(name) {
		name = name.match(/\w+Modules.*/g);
		name = name ? name[0] : '';
		name = name.replace('.js', '');
		name = name.replace(/\\/g, '/');
		return name;
	},
	
	evalJson: function(x){
		try{
			x = (new Function('return (' + x +')'))();
		}catch(e){
			if('string' === typeof x && x.indexOf('":')){
				
			}
		}
		return x;
	},

	getScopeArray: function(key, text, fileName) {
		var scope = [], scopeTexts = this.getLineValue(key, text);
		var i, k, scopeitem, scopeOters, j, q, item, itemA, itemBef, itemAfter, splitIndex;
		for(i = 0, k = scopeTexts.length; i < k; i++) {
			item = {};
			splitIndex = scopeTexts[i].indexOf('{');
			itemBef = scopeTexts[i].substr(0, splitIndex)
			itemAfter = scopeTexts[i].substr(splitIndex);
			itemAfter = itemAfter.replace(/\r|\n/, '');
			
			scopeitem = itemBef.split(/\s+/g);
			
			item = this.evalJson(itemAfter);
			item.key = scopeitem[0];
			item.description = scopeitem[1];
			scope.push(item)
		}
		return scope;
	},

	getLineValue: function(key, text, fileName) {
		text = text.replace(/\r/g, '');
		var regA = new RegExp(""+key+".*\\n", 'g');
		var regB = new RegExp(""+key+"\\s*");
		var value = text.match(regA) || '';
		var i, k, values = [];
		for(i = 0, k = value.length; i < k; i++) {
			values.push(value && value[i] ? value[i].replace(regB, '').replace(/\n/, '') : '')
		}
		
		return values.length ? values : '';
	}
}
exports.ReplaceModule = ReplaceModule

