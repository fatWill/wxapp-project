const Chokidar = require('chokidar');
const Path = require("path");
const Glob = require("glob");

const logger = require("./logger");
const less = require("./less");
const config = require("./config");

const cwd = process.cwd();

// 处理忽略文件
const dealIgnore = ignoreds => {
	let result = [];

	for (let ignored of ignoreds) {
		const {
			type,
			value
		} = ignored;

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

module.exports = () => {
	let ignore = [];
	let _config = {};

	try {
		_config = require(Path.resolve(cwd, config.filename));
		ignore = dealIgnore(_config.ignore);

	} catch (e) {
		logger.error(e);
		return
	}

	// less监听
	if (_config.less2wxss) {
		(async () => {
			let result = [];
			for (let pattern of ignore) {
				const files = await new Promise((resolve, reject) => {
					Glob(pattern, {
						ignore: "**/!(*.less)",
					}, (err, matches) => {
						if (err) {
							reject(err)
						} else {
							resolve(matches)
						}
					})
				})

				result = [...result, ...files];
			}

			return result;

		})().then(res => {
			// 创建忽略文件的对象映射
			let ignoreFiles = {};
			for (let ignoreFile of res) {
				Reflect.set(ignoreFiles, ignoreFile, Symbol());
			}

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
		})
	}

	// 图片转换监听
	if (_config.minifyImages) {
		const watcher = Chokidar.watch("**/*.@(png|jpeg|jpg)");

		watcher.on("add", async path => {
			
		});

		watcher.on("change", async path => {
			
		});

		watcher.on("unlink", path => {
			
		});
	}
}