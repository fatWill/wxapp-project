const Chokidar = require('chokidar');
const Path = require("path");
const Glob = require("glob");
const FG = require("fast-glob");
const Fs = require("fs-extra");

const logger = require("./logger");
const less = require("./less");
const minifyImage = require("./minify-image");
const common = require("./common");
const tools = require("./tools");
const os = require("./os");

const config = common.getConfig();
const cwd = common.getCWD();

/**
 * 有点乱，过后再整理下
 */

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

// 曲线救国
const globHasFile = async options => {
	let patterns = dealFile(options.patterns);

	patterns = patterns.map(value => {
		return "!" + value;
	})

	patterns = [...patterns, options.files]

	let result = await FG(patterns);

	if (result.length > 0) {
		return false
	} else {
		return true
	}
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

		if (tools.isArray(config.osfiles)) {
			try {
				const json = Path.resolve(cwd, "project.config.json");
				const data = Fs.readJsonSync(json);
				const packOptions = data.packOptions || {};
				const ignore = packOptions.ignore || [];

				// 对象去重
				const _ignore = [...ignore, ...config.osfiles].map(value => {
						if (tools.isObject(value)) {
							return JSON.stringify(value)
						} else {
							return ''
						}
					})
					.filter((value, index, arr) => {
						return value !== '' && arr.indexOf(value) === index;
					})
					.map(value => {
						return JSON.parse(value)
					});

				Fs.writeJsonSync(json, Object.assign(data, Object.assign(packOptions, {
					ignore: _ignore
				})), {
					spaces: "    "
				})
			} catch (e) {
				//
				console.log(e)
			}
		}
	}

	// 图片转换监听
	if (config.minifyImages) {
		let ignore = [];
		if (tools.isArray(config.ignore)) {
			ignore = dealFile(config.ignore);
		};

		const watcher = Chokidar.watch("**/*.@(png|jpeg|jpg|svg|gif)", {
			ignored: ignore,
			followSymlinks: false
		});

		const operate = async path => {
			await minifyImage(path).catch(rej => {
				logger.error(rej);
			});

			if (config.osfiles) {
				const has = await globHasFile({
					files: path,
					patterns: config.osfiles,
				});

				has && os(path);
			}
		}

		watcher.on("add", async path => {
			operate(path);
		});

		watcher.on("change", async path => {
			operate(path);
		});
	}
}