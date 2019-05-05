const Path = require("path")
const Fs = require("fs-extra");
const Klaw = require('klaw-sync')

const tools = require("./tools");
const logger = require("./logger");
const common = require("./common");
const cwd = common.getCWD();
const rootPath = common.getRootPath();

const isDir = path => {
	try {
		const stats = Fs.statSync(path);
		if (stats.isDirectory()) {
			return;
		} else {
			throw new Error("");
		}
	} catch (e) {
		logger.error(`${path} -- this path is not a dir`)
		process.exit();
	}
}

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
	} catch (e) {
		//
	}

	Fs.writeJson(Path.resolve(rootPath, "config.json"), Object.assign(json, {
			[tname]: path
		}))
		.then(() => {
			logger.success("set tmp config success");
		})
		.catch(() => {
			logger.error("set template config error");
		})
}

const getConfig = () => {
	let json = {};
	try {
		json = Fs.readJsonSync(configJSON)
	} catch (e) {
		//
	}

	console.log(JSON.stringify(json, null, '    '));
}

const copy = async (name, cmd) => {
	if (tools.isString(cmd.name)) {
		tname = cmd.name;
	} else {
		return;
	}

	let json = {};
	try {
		json = Fs.readJsonSync(configJSON)
	} catch (e) {
		//
	}

	const path = Reflect.get(json, tname);

	isDir(path);

	// 拷贝目录
	Fs.copy(path, Path.resolve(cwd, name)).then(() => {
		logger.success(`${name} directory created success!`);
	}).catch(() => {
		logger.error(`${name} directory created error!`);
	})
}

const qcProj = async (name, resource) => {
	const dir = Path.resolve(rootPath, resource);
	const newDir = Path.resolve(cwd, name);

	Fs.copy(dir, newDir).then(() => {
		logger.success(`${name}: demo miniprogram project created success!`);
	}).catch(() => {
		logger.error(`${name}: demo miniprogram project created error!`);
	})
}

const qcDir = async (name, resource, isPage = false) => {
	const dir = Path.resolve(rootPath, resource);
	const newDir = Path.resolve(cwd, name);

	let hasError = false;

	const filterFn = item => {
		const basename = Path.basename(item.path)
		return basename === '.' || basename[0] !== '.'
	}

	const items = Klaw(dir, {
		filter: filterFn,
		nodir: true
	});
	
	for (let item of items) {
		const file = Path.resolve(newDir, name + Path.extname(item.path));
		try {
			await Fs.ensureDir(newDir);
			const data = await Fs.readFile(item.path);
			await Fs.writeFile(file, data);

			logger.success(`${file}: created success!`);
		} catch (e) {
			hasError = true;
			logger.error(`${file}: created error!`);
			logger.error(e);
		}

	}

	// 在小程序项目中的app.json中加上路径
	if (isPage && !hasError) {
		const paths = cwd.split(Path.sep);

		let _paths = [...paths];
		let _filePaths = [];
		paths.some(() => {
			const json = Path.resolve(_paths.join(Path.sep), "app.json");
			try {
				const data = Fs.readJsonSync(json); // app.json数据
				const pages = data.pages; // app.json中页面配置的数组
				const dirName = _paths.slice(-1).join(""); // 项目文件的名字
				Fs.writeJson(json, Object.assign(data, {
					pages: [...new Set([...pages, Path.join(dirName, _filePaths.join(Path.sep), name, name)])],
				}), {
					spaces: "    "
				});
				return true;
			} catch (e) {
				_filePaths.unshift(..._paths.splice(-1));
				return false;
			}
		});
	}
}

const qcFile = async (name, resource) => {
	const file = Path.resolve(rootPath, resource);
	const newDir = Path.resolve(cwd, name + Path.extname(file));

	try {
		const data = await Fs.readFile(file);
		await Fs.writeFile(file, data);

		logger.success(`${file}: created success!`);
	} catch (e) {
		logger.error(`${file}: created error!`);
		logger.error(e);
	}
};

const create = async (name, cmd) => {
	let tname = "demo"
	if (tools.isString(cmd.from)) {
		tname = cmd.from;
	}

	switch (tname) {
		case "demo":
		default:
			qcProj(name, "template/demo");
			break;

		case "project":
			qcProj(name, "template/project");
			break;

		case "page":
			qcDir(name, "template/page", true);
			break;

		case "component":
			qcDir(name, "template/component");
			break;

		case "js":
			qcFile(name, "template/page/page.js");
			break;

		case "wxml":
			qcFile(name, "template/page/page.wxml");
			break;

		case "less":
			qcFile(name, "template/page/page.less");
			break;

		case "json":
			qcFile(name, "template/page/page.json");
			break;
	}
}

module.exports = {
	setconfig,
	getConfig,
	copy,
	create,
}