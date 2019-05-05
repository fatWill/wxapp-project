// platform

/********************************
 
	平台模块
	主要获取一些常用的基本信息
	比如版本的比较、系统信息的获取等

 ********************************/



const compareVersion = (v1, v2) => {
	v1 = v1.split('.');
	v2 = v2.split('.');
	let len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		let num1 = parseInt(v1[i]);
		let num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
};

export const systemInfo = wx.getSystemInfoSync();

/**
 * 基础库版本比较判断
 *
 * @param   {string} minVersion 最低版本
 *
 * @return  {number}            1为兼容版本 -1为不兼容版本 0为版本相同
 *
 * @example fq.compareVersion('1.11.0'); // => 1
 */
export const compareSdkVersion = minVersion => {
	// 获取sdk版本
	let SDKVersion = systemInfo.SDKVersion;
	return compareVersion(SDKVersion, minVersion);
};

/**
 * 微信版本比较判断
 *
 * @param   {string} minVersion 最低版本
 *
 * @return  {number}            1为兼容版本 -1为不兼容版本 0为版本相同
 *
 * @example      [example]
 */
export const compareWxVersion = minVersion => {
	// 获取微信版本
	let version = systemInfo.version;
	return compareVersion(version, minVersion);
};

/**
 * 微信小程序像素之间的换算
 *
 * @param   {number} width          要传入的rpx换算值
 *
 * @return  {[type]}            换算后的px值
 *
 * @example rpx2px(1000)
 */
export const rpx2px = (width = 0) => {
	// iphone6 的宽度
	let i6 = 375;
	let scale = systemInfo.windowWidth / i6;

	let pxW = Math.floor((width * scale) / 2);

	return pxW;
};