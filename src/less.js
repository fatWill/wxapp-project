const Path = require("path");
const Less = require("less");
const Fs = require("fs-extra");
const Px2rpx = require('px2rpx');
const CleanCSS = require('clean-css');
const Postcss = require("postcss");
const PostcssUrl = require('postcss-url');
const FileEntryCache = require('file-entry-cache');

const logger = require("./logger");
const common = require("./common");

const cwd = common.getCWD();
const config = common.getConfig();
const name = common.getName();
const cache = FileEntryCache.create(name, undefined, true);

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
const writeLess = (path, ignoreFiles, hasFileChanged = true) => {
	const basename = Path.basename(path, ".less");
	const router = Path.dirname(path);

	const content = Fs.readFileSync(path, 'utf-8');

	return new Promise((resolve, reject) => {
		Less.render(content, {
			filename: path,
			paths: [cwd]
		}).then(res => {
			let output = res.css;

			if (config.px2rpx) {
				const px2rpxIns = new Px2rpx({
					rpxUnit: config.rpxUnit > 0 ? config.rpxUnit : 1,
				});
				output = px2rpxIns.generaterpx(output);
			}

			if (config.minifyWxss) {
				output = new CleanCSS({
					level: 1
				}).minify(output).styles;
			}

			if (config.inlineUrl) {
				output = Postcss().use(PostcssUrl({
					url: 'inline',
					basePath: cwd,
				})).process(output);
			}

			if (!Reflect.has(ignoreFiles, path) && hasFileChanged) {
				Fs.writeFile(Path.resolve(router, `${basename}.wxss`), output, err => {
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
			const hasFileChanged = cache.hasFileChanged(path);

			const res = await writeLess(path, ignoreFiles, hasFileChanged);

			if (hasFileChanged) {
				logger.success(`add file success: ${path}`);
				cache.reconcile();
			}

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