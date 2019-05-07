// 对象存储
const COS = require('cos-nodejs-sdk-v5');
const Path = require('path');
const FileEntryCache = require('file-entry-cache');

const logger = require("./logger");
const common = require("./common");

const config = common.getConfig();
const name = common.getName();
const cache = FileEntryCache.create(name, undefined, true);

module.exports = path => {
	switch (config.os) {
		case "tx":
			cos(path);
			break;
	}
}

// 腾讯cos
const cos = (path) => {
	const hasFileChanged = cache.hasFileChanged(path);

	if (
		hasFileChanged &&
		config.secretId &&
		config.secretKey &&
		config.bucket &&
		config.region
	) {
		let _cos = new COS({
			SecretId: config.secretId,
			SecretKey: config.secretKey
		});

		const Bucket = config.bucket;
		const Region = config.region;
		const FilePath = path;
		const Key = path.split(Path.sep).join('/');

		_cos.sliceUploadFile({
			Bucket,
			Region,
			Key,
			FilePath,
		}, function(err, data) {
			if (err) {
				logger.error(`${path}: cos upload images error`)
				logger.error(JSON.stringify(err, null, "    "))
			}else{
				cache.reconcile();
				logger.success(`${path}: cos upload images success`)
			}
		});
	}
}