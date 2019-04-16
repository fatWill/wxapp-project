const Path = require("path");
const Fs = require("fs");

const config = require("./config");
const logger = require("./logger");
const cwd = process.cwd();

const _config = (() => {
	let _config = {};
	try {
		Fs.accessSync(Path.resolve(cwd, config.filename));
		try {
			_config = require(Path.resolve(cwd, config.filename));
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

const name = `wxp`;

const filename = `.${name}.json`;

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
	}
}