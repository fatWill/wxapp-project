const Imagemin = require('imagemin');
const ImageminGifsicle = require('imagemin-gifsicle');
const ImageminJpegtran = require('imagemin-jpegtran');
const ImageminPngquant = require('imagemin-pngquant');
const ImageminOptipng = require('imagemin-optipng');
const ImageminSvgo = require('imagemin-svgo');
const FileEntryCache = require('file-entry-cache');
const Path = require("path");

const Glob = require("glob");

const logger = require("./logger");
const common = require("./common");

const config = common.getConfig();
const name = common.getName();
const cache = FileEntryCache.create(name, undefined, true);

module.exports = async path => {
	const hasFileChanged = cache.hasFileChanged(path);
	if (hasFileChanged) {
		await Imagemin([path], Path.dirname(path), {
			plugins: [
				ImageminGifsicle(),
				ImageminJpegtran(),
				ImageminOptipng(),
				ImageminPngquant(),
				ImageminSvgo()
			]
		});
		cache.reconcile();
		logger.success(`minify image success: ${path}`);
	}
}