const ft = getApp();
const {regeneratorRuntime} = ft;

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    lifetimes: {
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad(options) {
            // 设置标题
            ft.setNavigation({
                type: "back",
                title: "功能展示"
            });
        },
    },

    events: {
        // 加了regeneratorRuntime便可以使用async语法糖
        // 关于lib包下的observers功能使用可看https://github.com/fatWill/wxapp-observers
        async modal() {
            await ft.showModal({
                title: "提示",
                content: "如果想自定义风格设置，可以自行修改，这些组件的文件都在/components中",
                confirm(){
                    ft.showToast({
                        icon: "success",
                        title: "你点击了确定",
                        mask: true,
                    })
                },
                cancel(){
                    ft.showToast({
                        icon: "fail",
                        title: "你点击了取消",
                        mask: true,
                    })
                },
            })
        },
        toast() {
            ft.showToast({
                title: "我是一个成功支付，可以无限字数～～"
            })
        },
        loading() {
            ft.showLoading({
                title: "加载中"
            })
        },
        hideLoading(){
            ft.hideLoading();
        },
        navigation(){
            ft.setNavigation({
                title: "动态修改了标题",
                titleColor: "#db3647"
            });
        }
    }

})