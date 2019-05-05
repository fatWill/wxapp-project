/********************************
 
    工具模块
    一些常用的数据封装方法

 ********************************/

// 常用方法
/**
 *
 * 判断类型
 *
 * @param {type} 传入一个数据类型
 *
 * @returns {boolean} 返回相对应数据类型的bool值
 *
 * @example
 *
 * utils.isNumber(1534409068); // => true
 */

function _type(arg) {
    return Reflect.toString.call(arg);
}
export function isString(arg) {
    return _type(arg) === "[object String]" ? true : false;
}
// 与isFinite不同的地方是NaN和Infinity都为true
export function isNumber(arg) {
    return _type(arg) === "[object Number]" ? true : false;
}
export function isObject(arg) {
    return _type(arg) === "[object Object]" ? true : false;
}
export function isUndefined(arg) {
    return _type(arg) === "[object Undefined]" ? true : false;
}
export function isNull(arg) {
    return _type(arg) === "[object Null]" ? true : false;
}
export function isFunction(arg) {
    return _type(arg) === "[object Function]" ? true : false;
}
export function isArray(arg) {
    return _type(arg) === "[object Array]" ? true : false;
}
export function isBoolean(arg) {
    return _type(arg) === "[object Boolean]" ? true : false;
}
// 判断数值是否为有限 即除了正常的数值为true，其余诸如NaN, Infinity, '15'都为false
export function isFinite(arg) {
    return Number.isFinite(arg);
}
export function isNaN(arg) {
    return Number.isNaN(arg);
}

/**
 *
 * 判断是否为空对象
 *
 * @param  {Object}   obj
 *
 * @return {Boolean}
 *
 * @example utils.isEmpty({}); // => true 
 */
export function isEmpty(obj = {}) {
    if (isObject(obj)) {
        for (let i in obj) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}