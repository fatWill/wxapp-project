const ft = getApp();
const {
    regeneratorRuntime
} = ft;

Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    lifetimes: {
        onLoad(options) {
            // 设置标题
            ft.setNavigation({
                type: "none",
                title: "WeChat"
            });


        },
    },

    methods: {

    },

    events: {

    }
})