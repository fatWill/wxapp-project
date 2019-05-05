// 计算头部栏, 兼容各种平台。
import * as platform from "../../common/platform.js";

let statusBarHeight = platform.systemInfo.statusBarHeight;
let capsuleHeight = 32;
let capsuleRight = 10;
let capsuleMaxWidth = 120;

let headerHeight = 0;
let statusBarDistance = 0;
if (platform.systemInfo.model.includes("iPhone") || platform.systemInfo.model.includes("iPad")) {
    statusBarDistance = 4;
    if (platform.systemInfo.platform === "devtools") {
        statusBarDistance = 6;
    }
    headerHeight = statusBarHeight + capsuleHeight + statusBarDistance * 2;
} else {
    statusBarDistance = 8;
    headerHeight = statusBarHeight + capsuleHeight + statusBarDistance * 2;
}

let navigationHeight = headerHeight - statusBarHeight;


// 为什么不用wx.getMenuButtonBoundingClientRect()
// 因为这个属性在真机上的bug实在感人，还是用估值做一个简单的兼容比较好
// 这里只是简单的设置下胶囊的值，实际上并未使用

const headerInfo = {
    headerHeight, // 导航栏总高度
    capsuleHeight, // 胶囊高度
    statusBarHeight, // 状态栏高度 版本1.9.0
    navigationHeight, // 导航栏内容区高度
    statusBarDistance, // 胶囊与导航栏内容区高度的上下距离
    capsuleRight, // 胶囊离右边的距离 参数都在10～11之间
    capsuleMaxWidth // 胶囊的宽度，宽度大小平均在87～100之间
};

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 头部兼容的基本信息
        headerInfo,

        // 导航栏默认值
        show: true,
        menuShow: true,
        menuImage: '/images/back.png',
        menuTap: 'back',
        backgroundImage: '',
        backgroundColor: '#f5f5f5',
        title: '',
        titleColor: '#000000',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            wx.navigateBack({
                delta: 1,
            });
        },
        home() {
            wx.reLaunch({
                url: "/main/pages/index/index"
            })
        },
    }
});