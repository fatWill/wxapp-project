module.exports = {
	isString(arg) {
		return _type(arg) === "[object String]" ? true : false;
	},
	// 与isFinite不同的地方是NaN和Infinity都为true
	isNumber(arg) {
		return _type(arg) === "[object Number]" ? true : false;
	},
	isObject(arg) {
		return _type(arg) === "[object Object]" ? true : false;
	},
	isUndefined(arg) {
		return _type(arg) === "[object Undefined]" ? true : false;
	},
	isNull(arg) {
		return _type(arg) === "[object Null]" ? true : false;
	},
	isFunction(arg) {
		return _type(arg) === "[object Function]" ? true : false;
	},
	isArray(arg) {
		return _type(arg) === "[object Array]" ? true : false;
	},
	isBoolean(arg) {
		return _type(arg) === "[object Boolean]" ? true : false;
	},
	// 判断数值是否为有限 即除了正常的数值为true，其余诸如NaN, Infinity, '15'都为false
	isFinite(arg) {
		return Number.isFinite(arg);
	},
	isNaN(arg) {
		return Number.isNaN(arg);
	},
}

function _type(arg) {
    return Reflect.toString.call(arg);
}