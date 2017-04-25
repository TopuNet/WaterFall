/*
    高京
    2016-08-11
    index页配套js
*/

define(["lib/WaterFall", "lib/jquery.min"], function($WaterFall) {
    var demo_string = {
        init: function() {

            var that = this;

            that.base_datalist = [];
            var i = 0;
            len = 80;
            for (; i < len; i++) {
                that.base_datalist[i] = {
                    img: "/images/" + i + ".jpg",
                    serial: i.toString()
                };
            }

            console.log(that.base_datalist);

            var WaterFall_obj = {
                box_selector: "section.list", // 瀑布流外盒选择器。无默认值
                item_selector: "div.list_item", // 项目单元选择器。必须存在于box内。无默认值
                item_width: 243, // 项目单元宽度。不包含列间距。无默认值
                line_top: 22, // 行 上间距。默认0
                line_first_top: 11, // 第一行 上间距。默认0
                column_left: 16, // 列 左间距。默认0
                column_first_left: 29, // 第一列 左间距。默认0
                // item_width: 30, // 项目单元宽度。不包含列间距。无默认值
                // line_top: 2, // 行 上间距。默认0
                // line_first_top: 1, // 第一行 上间距。默认0
                // column_left: 1, // 列 左间距。默认0
                // column_first_left: 1, // 第一列 左间距。默认0
                // unit: "vw",
                item_min: 2, // 最小列数，默认1。
                ps: len, // 每页显示数量。默认50（5×10）
                data_template: "<div class=\"list_item\"><img src=\"{$data-img}\" /><p style=\"text-align:center\">{$data-serial}</p></div>",
                datalist: that.base_datalist,
                resize_window_resize_column_number: true,
                callback_item_success: function(_item_obj) { // 项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值
                    // console.log("项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值");
                },
                callback_all_success: function() { // 成功回调。无默认值
                    console.log("成功回调。无默认值");
                },
                callback_none_success: function() { // 0数据行成功回调（没有数据）。无默认值
                    console.log("0数据行成功回调（没有数据）。无默认值");
                }
            };
            WaterFall.init(WaterFall_obj);

            this.button_Listener.apply(this);
        },
        button_Listener: function() {
            var that = this;

            $("button").click(function() {
                var arr = [];
                var i = 0,
                    len = 60;
                for (; i < len; i++)
                    arr[i] = that.base_datalist[i];
                var WaterFall_obj = {
                    datalist: arr,
                    clear_box: true // 是否清空已有项目单元
                };
                
                WaterFall.insert_items_list(WaterFall_obj);
            });
        }
    };

    return demo_string;
});
