#!/usr/bin/env node

const Path = require('path');
const Program = require('commander');

const package = require("../package");
const watcher = require("../src/watcher");
const logger = require("../src/logger");
const init = require("../src/init");

// 版本
Program
    .version(package.version, "-v, --version");

// init config
Program
    .command('init')
    .description('init config / ouput json')
    .action(() => {
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
    .command('new <dir>')
    .description('new template, name is folder (expand)')
    .action(function(name) {
        console.log(name);
    });

// help
Program
    .on('--help', () => {
        console.log()
        console.log(``)
        console.log()
    })

// 解析
Program.parse(process.argv);