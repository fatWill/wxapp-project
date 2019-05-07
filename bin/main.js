#!/usr/bin/env node

const Path = require('path');
const Program = require('commander');

const package = require("../package");
const watcher = require("../src/watcher");
const help = require("../src/help");
const init = require("../src/init");
const tmp = require("../src/template");

// 版本
Program
    .version(package.version, "-v, --version");

// init config
Program
    .command('init')
    .description('init config / ouput json')
    .action(() => {
        // 初始化配置
        init();
    });

// run
Program
    .command('run')
    .description('watch this dir & transform less')
    .action(function() {
        // 开启监听
        watcher();
    });

/**
 * create 和new的区别在于 new创建的是wxp项目中的文件
 */
// new 
Program
    .command('new <type>')
    .description('quick create miniprogram template(from wxp), type value: "demo|page|component|project|js|wxml|less|json')
    .option('-n, --name <name>', 'name value: "folder|file"')
    .action(async function(type, cmd) {
        tmp.new(type, cmd.name);
    });

// create
Program
    .command('create <key>')
    .description('quick create miniprogram template(from your project), type value is your project by config template key')
    .option('-n, --name <name>', 'name value: "folder|file"')
    .action(async function(key, cmd) {
        tmp.create(key, cmd.name);
    });

// help
Program
    .command('help')
    .action(function(name) {
        // 帮助信息
        help();
    });

Program
    .on('--help', () => {
        console.log()
        console.log(`Please give me a star support on my github`)
        console.log()
    })

// 解析
Program.parse(process.argv);

if (!process.argv.slice(2).length) {
    help();
}