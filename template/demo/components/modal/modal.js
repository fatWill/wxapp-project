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
		opt: "",
		content: "",
		showCancel: true,
		cancelText: "取消",
		confirmText: "确定",
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
        confirm() {
            // 防重
            if (!this.debounce) return;
            this.debounce = false;

            typeof this._confirm === 'function' && this._confirm();
            this.hideModal();
        },
        cancel() {
            // 防重
            if (!this.debounce) return;
            this.debounce = false;

            typeof this._cancel === 'function' && this._cancel();
            this.hideModal();
        }
    }
});