import {IninComponent} from "../../common/common";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    lifetimes: {
        attached() {
            const ocomp = new Map()
                .set("modal", this.selectComponent("#ft-modal"))
                .set("toast", this.selectComponent("#ft-toast"))
                .set("navigation", this.selectComponent("#ft-navigation"))

            this::IninComponent(ocomp);
        }
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            wx.navigateBack({
                delta: 1,
            });
        }
    }
});