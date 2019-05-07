const Path = require("path")
const Fs = require("fs-extra");
const Klaw = require('klaw-sync')

const tools = require("./tools");
const logger = require("./logger");
const common = require("./common");
const cwd = common.getCWD();
const rootPath = common.getRootPath();
const filePath = common.getFileName();

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

// 通过项目中的.wxp.json的位置来确定小程序的项目根目录
const project = (function getAPPJSON(path) {
	const roots = path.join(Path.sep);
	const json = Path.resolve(roots, filePath);
	const exit = Fs.existsSync(json);
	if (exit) {
		return roots;
	} else {
		if (path.length > 0) {
			return getAPPJSON(path.slice(0, -1));
		} else {
			return null
		}
	}
})(cwd.split(Path.sep))

const appJsonAddPage = async path => {
	if (!project) return;

	const relativePath = path;

	const appJSON = Path.resolve(project, "app.json");

	const _project = project.split(Path.sep);
	const _relativePath = relativePath.split(Path.sep);

	const absoultePath = _relativePath.filter(value => !_project.includes(value));

	const data = Fs.readJsonSync(appJSON); // app.json数据
	const pages = data.pages; // app.json中页面配置的数组
	Fs.writeJson(appJSON, Object.assign(data, {
		pages: [...new Set([...pages, absoultePath.join("/")])],
	}), {
		spaces: "    "
	});
}

const qcProj = async (name, resource) => {
	const dir = resource;
	const newDir = Path.resolve(cwd, name);

	Fs.copy(dir, newDir).then(() => {
		logger.success(`${name}: demo miniprogram project created success!`);
	}).catch(() => {
		logger.error(`${name}: demo miniprogram project created error!`);
	})
}

const qcDir = async (name, resource, isPage = false) => {
	const dir = resource;
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
		appJsonAddPage(Path.resolve(newDir, name));
	}
}

const qcFile = async (name, resource) => {
	const file = resource;
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

const create = async (type, name, resource) => {
	switch (type) {
		case "demo":
		default:
			resource = resource ? resource : Path.resolve(rootPath, "template/demo");
			qcProj(name, resource);
			break;

		case "project":
			resource = resource ? resource : Path.resolve(rootPath, "template/project");
			qcProj(name, resource);
			break;

		case "page":
			resource = resource ? resource : Path.resolve(rootPath, "template/page");
			qcDir(name, resource, true);
			break;

		case "component":
			resource = resource ? resource : Path.resolve(rootPath, "template/component");
			qcDir(name, resource);
			break;

		case "js":
			resource = resource ? resource : Path.resolve(rootPath, "template/page/page.js");
			qcFile(name, resource);
			break;

		case "wxml":
			resource = resource ? resource : Path.resolve(rootPath, "template/page/page.wxml");
			qcFile(name, resource);
			break;

		case "less":
			resource = resource ? resource : Path.resolve(rootPath, "template/page/page.less");
			qcFile(name, resource);
			break;

		case "json":
			resource = resource ? resource : Path.resolve(rootPath, "template/page/page.json");
			qcFile(name, resource);
			break;
	}
}

const _create = async (key = "", name) => {
	let type = "";
	let resource = ""; // 文件的源路径
	try {
		const wxpJSON = Path.resolve(project, filePath);
		const json = Fs.readJsonSync(wxpJSON); // .wxp.json数据
		if (tools.isObject(json.template)) {
			const data = Reflect.get(json.template, key);
			if (data && data.path && data.type) {
				type = data.type;
				resource = Path.resolve(project, data.path);
			} else {
				logger.error(".wxp.json template value: ");
				logger.error(JSON.stringify(json.template, null, "    "));
				throw new Error(`.wxp.json: name value(${name}) is error`);
			}
		} else {
			throw new Error(".wxp.json: template is not a object");
		}
	} catch (e) {
		logger.error(e);
		process.exit(0);
	}

	create(type, name, resource);
}

const _new = async (type, name) => {
	create(type, name);
}

module.exports = {
	new: _new,
	create: _create
}