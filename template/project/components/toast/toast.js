// components/toast/toast.js
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
        show: false,
        title: "",
        content: "",
        icon: "success",
        image: "",
        duration: 1500,
        longShow: false,
        mask: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        hideModal() {
            this.setData({
                show: false,
            });
        },
    }
})
