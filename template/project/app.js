// 小程序全局启动生命周期
const lifeTime = {
    /*
    小程序初始化完成时（全局只触发一次）
    **/
    onLaunch() {

    },

    /*
      小程序启动，或从后台进入前台显示时
    **/
    onShow() {

    },
    /*
      小程序从前台进入后台时
    **/
    onHide() {

    },
    /*
      小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
    **/
    onError() {

    },
    /*
      小程序要打开的页面不存在时触发。
      版本最低1.9.90
    **/
    onPageNotFound() {

    },
};

const app = Object.assign(lifeTime, {
    platform,
    utils,
});

App(app);

import * as platform from 'common/platform';
import * as utils from 'common/utils';

import 'lib/observers';