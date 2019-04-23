const Chokidar = require('chokidar');
const Path = require("path");
const Glob = require("glob");
const Fs = require("fs-extra");

const logger = require("./logger");
const less = require("./less");
const minifyImage = require("./minify-image");
const common = require("./common");
const tools = require("./tools");
const os = require("./os");

const config = common.getConfig();

// 处理配置的文件处理
const dealFile = files => {
	let result = [];

	for (let file of files) {
		const {
			type,
			value
		} = file;

		switch (type) {

			case 'folder':
				result.push(Path.join(value, "**/*"));
				break;

			case 'suffix':
				result.push(`**/*${value}`);
				break;

			case 'prefix':
				result.push(`**/${value}.*`);
				break;

			case 'file':
			case 'regexp':
			case 'glob':
				result.push(value);
				break;

			default:
				//
				break;
		}
	}

	return result;
}

const getFiles = async options => {
	let ofiles = {};

	if (!tools.isArray(options.files)) {
		return ofiles;
	};

	let results = [];
	let patterns = dealFile(options.files);
	for (let pattern of patterns) {
		const files = await new Promise((resolve, reject) => {
			Glob(pattern, options.glob, (err, matches) => {
				if (err) {
					reject(err)
				} else {
					resolve(matches)
				}
			})
		})

		results = [...results, ...files];
	}

	// 创建忽略文件的对象映射
	for (let result of results) {
		Reflect.set(ofiles, result, Symbol());
	}

	return ofiles;
}

module.exports = async () => {

	// less监听
	if (config.less2wxss) {
		const ignoreFiles = await getFiles({
			glob: {
				ignore: "**/!(*.less)"
			},
			files: config.ignore
		});

		const watcher = Chokidar.watch("**/*.less");

		watcher.on("add", async path => {
			less.add(path, ignoreFiles);
		});

		watcher.on("change", async path => {
			less.change(path, ignoreFiles);
		});

		watcher.on("unlink", path => {
			less.unlink(path);
		});
	}

	// 对象存储
	let osfiles = null;
	if (config.os !== "") {
		osfiles = await getFiles({
			files: config.osfiles
		});
	}

	// 图片转换监听
	if (config.minifyImages) {
		let ignore = [];
		if (tools.isArray(config.ignore)) {
			ignore = dealFile(config.ignore);
		};

		const watcher = Chokidar.watch("**/*.@(png|jpeg|jpg|svg|gif)", {
			ignored: ignore,
			followSymlinks: false,
		});

		watcher.on("add", async path => {
			await minifyImage(path);
			osfiles && os(path, osfiles);

		});

		watcher.on("change", async path => {
			await minifyImage(path);
			osfiles && os(path, osfiles);
		});
	}
}