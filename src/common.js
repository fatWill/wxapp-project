const Path = require("path");
const Fs = require("fs-extra");
const PkgDir = require('pkg-dir');

const config = require("./config");
const logger = require("./logger");
const cwd = process.cwd();

const name = `wxp`;

const filename = `.${name}.json`;

const _config = (() => {
	let _config = {};
	try {
		Fs.accessSync(Path.resolve(cwd, filename));
		try {
			_config = Fs.readJsonSync(Path.resolve(cwd, filename));
			_config = Object.assign(config, _config);
		} catch (e) {
			logger.error(".wxp.json is not a object");
			logger.error(e);
			process.exit();
		}
	} catch (e) {
		_config = config;
	}
	return _config;
})()



module.exports = {
	getConfig() {
		return _config;
	},

	getCWD() {
		return cwd;
	},

	getName() {
		return name;
	},

	getFileName() {
		return filename;
	},

	getRootPath() {
		return PkgDir.sync(__dirname);
	}
}