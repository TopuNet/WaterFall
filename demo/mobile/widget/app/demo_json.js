/*
    高京
    2016-08-11
    index页配套js
*/

define(["lib/WaterFall", "lib/mobile_stop_moved", "lib/zepto.min"], function($WaterFall, $mobile_stop_moved) {
    var demo_string = {
        init: function() {
            $mobile_stop_moved.init({
                selector: "section.wrap", // 容器盒选择器（resize_toWindow为false时，需要在样式表中将此盒定高），无默认值
                scroll: true, // 盒内可滚动，默认true
                resize_toWindow: true // 将容器盒自动设置为有效窗口高度(window.innerHeight)，并监听窗口大小改变——解决ios safari浏览器底部工具栏遮挡页面的问题，默认true
            });

            var base_datalist = new Array();
            var i = 0;
            len = 20;
            var base_datalist = [];
            for (; i < len; i++) {
                base_datalist[i] = {
                    img: "/images/" + i + ".jpg",
                    serial: i.toString()
                };
            }

            var WaterFall_obj = {

                listener_scroll_selector: "section.wrap", // 监听滚动的选择器。默认window
                box_selector: "section.list", // 项目单元外盒选择器。无默认值
                item_selector: "div.list_item", // 项目单元选择器。必须存在于box内。无默认值
                item_width: 30, // 项目单元宽度。不包含列间距。无默认值
                line_top: 2, // 行 上间距。默认0
                line_first_top: 1, // 第一行 上间距。默认0
                column_left: 1, // 列 左间距。默认0
                column_first_left: 1, // 第一列 左间距。默认0
                unit: "vw",
                item_min: 2, // 最小列数，默认1。
                ps: len, // 每页显示数量。默认50（5×10）
                data_template: "<div class=\"list_item\"><img src=\"{$data-img}\" /><p style=\"text-align:center\">{$data-serial}</p></div>",
                datalist: base_datalist,
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
            }
            WaterFall.init(WaterFall_obj);
        }
    };

    return demo_string;
});
