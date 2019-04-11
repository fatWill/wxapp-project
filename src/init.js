const Path = require('path');
const Fs = require('fs');

const config = require("./config");
const logger = require("./logger");

module.exports = () => {
	const cwd = process.cwd();

	let nconfig = {};

	process.stdin.setEncoding('utf8');

	logger.log(`
This utility will walk you through creating a .wxp.json file.
It only covers the most common items, and tries to guess sensible defaults.
        `);

	const outputJSON = () => {

		Reflect.set(nconfig, "ignore", config.ignore);

		const content = JSON.stringify(nconfig, null, '    ');

		const cwd = process.cwd();

		const file = Path.resolve(cwd, config.filename);

		return {
			content,
			file
		}
	};

	// step 1;
	let step = 'less2wxss';
	process.stdout.write(`open less2wxss: y/n? (${config.less2wxss ? 'y' : 'n'}) `);

	process.stdin.on('data', chunk => {
		chunk = chunk.trim();

		switch (step) {
			case 'less2wxss':
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

				process.stdout.write(`open minifyImages: y/n? (${config.minifyImages ? 'y' : 'n'}) `);
				step = 'minifyImages';

				break;

			case 'minifyImages':
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

				const {
					content,
					file
				} = outputJSON();

				logger.log();
				logger.log(`About to write to ${file}:`);
				logger.log(content);

				process.stdout.write(`Is this ok? (yes) `);
				step = 'end';
				break;

			case 'end':
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
				break;
		};


	});
}