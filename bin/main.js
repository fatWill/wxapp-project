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

// new
Program
    .command('new <name>')
    .description('quick create miniprogram template, name is [folder|file] name')
    .option('-n, --name <name>', 'name is your config key')
    .option('-f, --from [name]', 'from is name by "demo|page|component|project|js|wxml|less|json')
    .action(async function(name, cmd) {
        tmp(name, cmd);
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