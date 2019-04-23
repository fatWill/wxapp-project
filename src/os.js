// 对象存储
const COS = require('cos-nodejs-sdk-v5');

const logger = require("./logger");
const common = require("./common");
const FileEntryCache = require('file-entry-cache');

const config = common.getConfig();
const name = common.getName();
const cache = FileEntryCache.create(name, undefined, true);

module.exports = (path, osfiles) => {
	if (!Reflect.has(osfiles, path)) return;

	switch (config.os) {
		case "tx":
			cos(path);
			break;
	}
}

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

		_cos.sliceUploadFile({
			Bucket: config.bucket,
			Region: config.region,
			Key: path,
			FilePath: path,
		}, function(err, data) {
			if (err) {
				logger.error("cos: upload images error")
				logger.error(err)
			}else{
				cache.reconcile();
				logger.success("cos: upload images success")
			}
		});
	}
}