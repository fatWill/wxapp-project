const LessPluginCleanCSS = require('less-plugin-clean-css');
const Path = require("path");
const Less = require("less");
const Fs = require("fs");

const logger = require("./logger");

const cwd = process.cwd();

// 依赖映射
const dependReflect = {};
const setDependReflect = (root, depend) => {
	depend.forEach(value => {
		let node = Reflect.get(dependReflect, value);

		node = node ? node : [];
		Reflect.set(dependReflect, value, [...node, root]);
	});
};

const getDependReflect = (depend) => {
	return Reflect.get(dependReflect, depend);
}

const delDependReflect = (depend) => {
	return Reflect.deleteProperty(dependReflect, depend);

}

// 将less写入
const writeLess = (path, ignoreFiles) => {
	const content = Fs.readFileSync(path, 'utf-8');
	const basename = Path.basename(path, ".less");
	const router = Path.dirname(path);

	return new Promise((resolve, reject) => {
		Less.render(content, {
			plugins: [new LessPluginCleanCSS()],
			filename: path,
			paths: [cwd]
		}).then(res => {
			if (!Reflect.has(ignoreFiles, path)) {
				Fs.writeFile(Path.resolve(router, `${basename}.wxss`), res.css, err => {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				});
			} else {
				resolve(res);
			}
		}).catch(rej => {
			reject(rej);
		})
	})

}

module.exports = {
	async add(path, ignoreFiles) {
		try {
			const res = await writeLess(path, ignoreFiles);
			logger.success(`add file success: ${path}`);

			const router = Path.dirname(path);
			const root = Path.resolve(path);

			// 创建依赖

			const depend = res.imports.map(value => {
				return Path.resolve(router, value);
			});

			setDependReflect(root, depend);

		} catch (err) {
			logger.error(`add file fail: ${path}`);
			logger.error(err);
		}
	},

	async change(path, ignoreFiles) {
		const depend = Path.resolve(path);

		let roots = getDependReflect(depend);
		roots = roots ? roots : [];

		for (let root of [path, ...roots]) {

			try {
				await writeLess(root, ignoreFiles);
				logger.success(`change file success: ${root}`);

			} catch (err) {
				logger.error(`change file fail: ${root}`);
				logger.error(err);
			}
		}
	},

	unlink(path) {
		const depend = Path.resolve(path);

		const basename = Path.basename(path, ".less");
		const router = Path.dirname(root);

		delDependReflect(depend);

		Fs.unlink(Path.resolve(router, `${basename}.wxss`), (err) => {
			if (err) {
				logger.error(`delete file fail: ${path}`);
				logger.error(err);
			} else {
				logger.warn(`delete file success: ${path}`);
			}
		});

	}
}