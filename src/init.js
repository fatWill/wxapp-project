const Path = require('path');
const Fs = require('fs');

const common = require("./common");
const tools = require("./tools");
const logger = require("./logger");

const config = common.getConfig();
const cwd = common.getCWD();
const fileName = common.getFileName();

module.exports = () => {

	let nconfig = {};

	process.stdin.setEncoding('utf8');

	logger.log(`
This utility will walk you through creating a .wxp.json file.
It only covers the most common items, and tries to guess sensible defaults.
        `);

	const outputJSON = () => {
		nconfig = Object.assign(config, nconfig);

		const content = JSON.stringify(nconfig, null, '    ');

		const cwd = process.cwd();

		const file = Path.resolve(cwd, fileName);

		return {
			content,
			file
		}
	};

	const initCurrying = (describe, callback) => {
		let stds = [];
		let _callback = null;

		const _curring = (...args) => {
			const len = args.length;
			if (len > 1) {
				const [describe, callback] = args;

				stds.unshift({
					describe,
					callback
				});

				return _curring;
			} else {
				const [chunk] = args;
				const last = stds.length - 1;

				!tools.isUndefined(chunk) && _callback(chunk);

				if (last < 0) return;

				const {
					describe,
					callback
				} = stds[last];

				stds.pop();

				describe && process.stdout.write(describe);

				_callback = callback;

				return _curring;
			}
		}

		_curring(describe, callback);

		return _curring;
	}

	let step = initCurrying(`open less2wxss: y/n? (${config.less2wxss ? 'y' : 'n'}) `, chunk => {
		switch (chunk) {
			case 'y':
				nconfig.less2wxss = true;
				break;

			case 'n':
				nconfig.less2wxss = false;
				break;

			default:
				nconfig.less2wxss = config.less2wxss;
				break;
		}
	})

	step = step(`open minifyImages: y/n? (${config.minifyImages ? 'y' : 'n'}) `, chunk => {
		switch (chunk) {
			case 'y':
				nconfig.minifyImages = true;
				break;

			case 'n':
				nconfig.minifyImages = false;
				break;

			default:
				nconfig.minifyImages = config.minifyImages;
				break;
		}

	})

	step = step(`open px2rpx: y/n? (${config.px2rpx ? 'y' : 'n'}) `, chunk => {
		switch (chunk) {
			case 'y':
				nconfig.px2rpx = true;
				break;

			case 'n':
				nconfig.px2rpx = false;
				break;

			default:
				nconfig.px2rpx = config.px2rpx;
				break;
		}
	})

	step = step(`open inlineUrl: y/n? (${config.inlineUrl ? 'y' : 'n'}) `, chunk => {
		switch (chunk) {
			case 'y':
				nconfig.inlineUrl = true;
				break;

			case 'n':
				nconfig.inlineUrl = false;
				break;

			default:
				nconfig.inlineUrl = config.inlineUrl;
				break;
		}

		const {
			content,
			file
		} = outputJSON();

		logger.log();
		logger.log(`About to write to ${file}:`);
		logger.log(content);
	})

	step = step(`Is this ok? (yes) `, chunk => {
		switch (chunk) {
			case 'yes':
			case '':
				const {
					content,
					file
				} = outputJSON();

				Fs.writeFile(file, content, err => {
					if (err) {
						logger.error(`json created error!`);
						logger.error(err);
					} else {
						logger.log(`created ok!`);
					}
					process.exit();
				})

				break;
			default:
				logger.log('Aborted.');
				process.exit();
				break;
		}
	})

	let run = step();

	process.stdin.on('data', chunk => {
		chunk = chunk.trim();
		run = run(chunk);
	});
}