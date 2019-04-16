const chalk = require('chalk');
const package = require("../package");

let help = '';

help += chalk.blue(
	`
	██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ██╗    ██╗██╗  ██╗██████╗ 
	██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ██║    ██║╚██╗██╔╝██╔══██╗
	██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗      ██║ █╗ ██║ ╚███╔╝ ██████╔╝
	██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝      ██║███╗██║ ██╔██╗ ██╔═══╝ 
	╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗    ╚███╔███╔╝██╔╝ ██╗██║     
	 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   

`);

// help += chalk.green(
// 	`
// wxapp-project(wxp) is a miniprogram work flow, you can develop your project more efficiently.

// Currently supported:
//   -less to wxss
//   -minify images
//   -quick build miniprogram project
// `)

help += chalk.white(
	`
Usage: wxp <command>

where <command> is one of:
  help, init, new, run, version

wxp <command> -h   quick help on <command>

wxp info
  -version: ${package.version}
  -bin: ${process.argv[1]}

`
)

module.exports = function() {
	console.log(help);
}