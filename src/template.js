const Path = require("path")
const Fs = require("fs-extra");
const PkgDir = require('pkg-dir');

const tools = require("./tools");
const logger = require("./logger");
const common = require("./common");
const cwd = common.getCWD();

const isDir = path => {
	try{
		const stats = Fs.statSync(path);
		if (stats.isDirectory()) {
			return;
		}else{
			throw new Error("");
		}
	}catch(e){
		logger.error(`${path} -- this path is not a dir`)
		process.exit();
	}
}

const rootPath = PkgDir.sync(__dirname);
const configJSON = Path.resolve(rootPath, "config.json");

const setconfig = (path, cmd) => {
	isDir(path);

	if (!Path.isAbsolute(path)) {
		// 相对路径
		path = Path.resolve(cwd, path);
	}

	let tname = 'default';
	if (tools.isString(cmd.name)) {
		tname = cmd.name;
	};

	let json = {};
	try {
		json = Fs.readJsonSync(configJSON)
	}catch(e){
		//
	}

	Fs.writeJson(Path.resolve(rootPath, "config.json"), Object.assign(json, {[tname]: path}))
		.then(()=>{
			logger.success("set tmp config success");
		})
		.catch(()=>{
			logger.error("set template config error");
		})
}

const getConfig = () => {
	let json = {};
	try {
		json = Fs.readJsonSync(configJSON)
	}catch(e){
		//
	}

	console.log(JSON.stringify(json, null, '    '));
}

const copy = (name, cmd) => {
	let tname = 'default';
	if (tools.isString(cmd.name)) {
		tname = cmd.name;
	};

	let json = {};
	try {
		json = Fs.readJsonSync(configJSON)
	}catch(e){
		//
	}

	const path = Reflect.get(json, tname);

	isDir(path);

	// 拷贝目录
	Fs.copy(path, Path.resolve(cwd, name)).then(()=>{
		logger.success(`${name} directory created success!`);
	}).catch(()=>{
		logger.error(`${name} directory created error!`);
	})
}

module.exports = {
	setconfig,
	getConfig,
	copy,
}