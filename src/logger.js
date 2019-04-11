const chalk = require('chalk');

const log = console.log;
module.exports = {
	log(msg = '') {
		log(chalk.white(msg));
	},
	info(msg = '') {
		log(chalk.blue(msg));
	},
	success(msg = '') {
		log(chalk.green(msg));
	},
	warn(msg = '') {
		log(chalk.yellow(msg));
	},
	error(msg = '') {
		log(chalk.red(msg));
	},
}