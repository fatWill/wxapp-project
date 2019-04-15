// default config;
module.exports = {
	less2wxss: true,
	px2rpx: true,
	minifyWxss: true,
	rpxUnit: 1,
	inlineUrl: true,
	tinifyImage: false,
	ignore: [{
		type: 'folder',
		value: 'node_modules',
	}],

	filename: '.wxp.json',
	name: 'wxp',
}