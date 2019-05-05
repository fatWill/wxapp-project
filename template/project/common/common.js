// common

/********************************
 
	公用方法模块
	把公用的方法附属在getApp()中

 ********************************/

import regeneratorRuntime from "../lib/regeneratorRuntime.min";

const ft = getApp();

ft.regeneratorRuntime = regeneratorRuntime;

const getPage = () => {
	const currentPage = getCurrentPages();

	let page = null;

	if (currentPage.length > 0) {
		page = currentPage[currentPage.length - 1];
	} else {
		throw new Error("get currentPage error", currentPage);
		console.error("get currentPage error", currentPage);
	}

	return page;
}

export const IninComponent = function(ocomp) {
	let page = getPage();

	for (let [key, value] of ocomp) {
		Reflect.set(page, Symbol.for(key), value);
	}

};

ft.showModal = (options = {}) => {
	let page = getPage();

	let component = Reflect.get(page, Symbol.for("modal"));

	// default	
	let setting = {
		show: true,
		title: "",
		opt: "",
		content: "",
		showCancel: true,
		cancelText: "取消",
		confirmText: "确定",
	};

	component._confirm = typeof options.confirm === 'function' ? options.confirm : null;
	component._cancel = typeof options.cancel === 'function' ? options.cancel : null;

	// 防重
	component.debounce = true;

	component.setData(Object.assign(setting, options));
};

let toastTimer = null;
ft.showToast = (options = {}) => {
	if (toastTimer) {
		clearTimeout(toastTimer)
		toastTimer = null;
	}

	let page = getPage();

	let component = Reflect.get(page, Symbol.for("toast"));

	// default	
	let setting = {
		show: true,
        title: "",
        content: "",
        icon: "success",
        image: "",
        duration: 1500,
        longShow: false,
        mask: false,
	}

	component.setData(Object.assign(setting, options));

	if (!setting.longShow) {
		let duration = setting.duration && typeof setting.duration === 'number' && setting.duration > 0 ? setting.duration : setting.duration;
		toastTimer = setTimeout(() => {
			component.setData({
				show: false
			});
		}, duration);
	}
};

ft.hideToast = () => {
	let page = getPage();

	let component = Reflect.get(page, Symbol.for("toast"));

	component.hideModal();
};

ft.showLoading = (options = {}) => {
	ft.showToast({
		title: options.title || "",
		mask: options.mask || null,
		icon: "loading",
		longShow: true,
	})
}

ft.hideLoading = () => {
	ft.hideToast();
}

ft.setNavigation = (options = {}) => {
	let page = getPage();

	let component = Reflect.get(page, Symbol.for("navigation"));

	// get now	
	let setting = component.data;

	// 设置一些常用的type
	options.type = options.type || "back";
	switch(options.type) {
		case "back":
		options.menuTap = "back";
		options.menuImage= '/images/back.png';
		break;

		case "home":
		options.menuTap = "home";
		options.menuImage= '/images/home.png';
		break;

		case "none":
		default:
		options.menuShow = false;
		break;
	}

	component.setData(Object.assign(setting, options));
}