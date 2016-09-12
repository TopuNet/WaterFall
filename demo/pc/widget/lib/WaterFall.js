/*
    v1.1.2
    高京
    2016-08-12
    瀑布流
*/
var WaterFall = {
    paras: null,
    box_width_px: 0, // 外盒宽度，init计算
    box_height_px: 0, // 外盒高度，累加计算
    column_count: 0, // 列数，init计算
    column_height_px: null, // 每列高度，装载时计算
    column_shortest_height_min_px: 0, // 最矮列的height，装载时计算
    window_height_px: 0, // 窗口高度
    box_top_px: 0, // 外盒top
    item_inserting: false, // 标记正在装载项目——防止同一时间多次调用装载。窗口滚动和窗口resize时会判断是否空闲。
    window_scroll_listen: true, // 标记是否监听窗口滚动（动态加载项目单元），重载数据时停止监听
    window_resize_listen: true, // 标记是否监听窗口改变大小，重置窗口大小时改成false，防止拖动浏览器边缘改变大小时频繁调用出现问题
    insert_n: -1, // 已插入datalist的序号
    init: function(waterfall_obj) {
        var obj_default = {
            listener_scroll_selector: null, // 监听滚动的选择器。默认window，移动端使用mobile_stop_moved模块时，可以设置为最外盒
            listener_scroll_selector_scroll_listener: null, // 如页面对监听滚动的选择器有其他的scroll监听事件方法，则在此参数传入
            box_selector: null, // 项目单元外盒选择器。无默认值。后自动设置行内元素样式 position: relative;
            item_selector: null, // 项目单元选择器。必须存在于box内。无默认值
            item_width: null, // 项目单元宽度。不包含列间距。无默认值
            line_top: 0, // 行 上间距。默认0
            line_first_top: 0, // 第一行 上间距。默认0
            column_left: 0, // 列 左间距。默认0
            column_first_left: 0, // 第一列 左间距。默认0
            unit: "px", // 宽高单位 "px|vw", 默认px。且重置窗口大小时，vw不重新计算对应的px
            item_min: 1, // 最小列数，默认1。
            ps: 50, // 每页显示数量。默认50（5×10）
            data_template: null, // 项目单元模板字符串。不传此参数，则项目单元直接装载datalist；传此参数，则datalist需要传入json对象，按键名替换模板中的${data-key}。
            datalist: null, // 项目单元内容。支持字符串数组或JSON对象。JSON对象需配合data_template使用
            resize_window_resize_column_number: false, // 改变窗口大小时，重新计算列宽度（清空所有项目单元并重新加载，耗资源），默认false
            callback_item_success: null, // 项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值
            callback_all_success: null, // 第一次加载时，所有需要加载的图片加载成功回调。无默认值
            callback_none_success: null // 0数据行成功回调（没有数据）。无默认值
        };
        this.paras = $.extend(obj_default, waterfall_obj);
        this.paras.listener_scroll_obj = this.paras.listener_scroll_selector ? $(this.paras.listener_scroll_selector) : $(window);

        // 设置box的position
        $(this.paras.box_selector).css("position", "relative");

        // 将vw转换为px
        this.vw2px();

        // 重计算 单元数量
        this.resize_item();

        // 开始装载项目单元
        this.insert_item();

        // 监听窗口滚动
        this.window_scroll();

        // 监听改变窗口大小
        this.window_resize();
    },

    // 将vw转换为px
    vw2px: function() {
        var _para = WaterFall.paras;
        if (_para.unit == "px")
            return;

        var _window_width = this.paras.listener_scroll_obj.width();
        WaterFall.paras.item_width = WaterFall.paras.item_width / 100 * _window_width;
        WaterFall.paras.line_top = WaterFall.paras.line_top / 100 * _window_width;
        WaterFall.paras.line_first_top = WaterFall.paras.line_first_top / 100 * _window_width;
        WaterFall.paras.column_left = WaterFall.paras.column_left / 100 * _window_width;
        WaterFall.paras.column_first_left = WaterFall.paras.column_first_left / 100 * _window_width;
    },

    // 重载/插入 项目单元，支持外部调用。改变窗口大小时也有用到。
    insert_items_list: function(paras) {
        var paras_default = {
            datalist: null,
            clear_box: false // 是否清空现有内容，true/false。默认false
        };

        paras = $.extend(paras_default, paras);

        WaterFall.paras.datalist = paras.datalist;

        // 清空插入单元计数器
        WaterFall.insert_n = -1;

        // 清空已有图片
        if (paras.clear_box) {

            // 暂停window.scroll监听
            WaterFall.window_scroll_listen = false;
            WaterFall.window_scroll();

            // 还原全局变量
            WaterFall.box_height_px = 0;
            WaterFall.column_height_px = null;
            WaterFall.column_shortest_height_min_px = 0;

            // 改变外盒高度
            $(WaterFall.paras.box_selector).animate({
                height: "0px"
            }, 200, function() {

                WaterFall.window_scroll_listen = true;

                $(this).html("");

                // 重计算列数量
                WaterFall.resize_item();

                WaterFall.insert_item();
            });
        } else
            WaterFall.insert_item();

        WaterFall.window_scroll_listen = true;
    },

    // 监听窗口滚动
    window_scroll: function() {
        this.paras.listener_scroll_obj.unbind("scroll");

        // 绑定对listener_scroll_obj的其他绑定方法（页面传入）
        if (this.paras.listener_scroll_selector_scroll_listener) {
            this.paras.listener_scroll_obj.scroll(function() {
                WaterFall.paras.listener_scroll_selector_scroll_listener();
            });
        }

        // 是否有scroll监听
        if (!WaterFall.window_scroll_listen)
            return;
        this.paras.listener_scroll_obj.scroll(function() {
            WaterFall.valid_toInsert();
        });
    },

    // 监听窗口resize
    window_resize: function() {

        var resize_n = 0;
        $(window).resize(function() {

            if (!WaterFall.window_resize_listen)
                return;

            WaterFall.window_resize_listen = false;

            if (++resize_n % 2 === 0)
                return;

            setTimeout(function() {

                WaterFall.window_height_px = $(window).height();

                if (WaterFall.paras.resize_window_resize_column_number) {
                    // 清空已有列表，重新计算并加载图片
                    WaterFall.insert_items_list({
                        datalist: WaterFall.paras.datalist,
                        clear_box: true
                    });
                } else
                // 不清空列表，计算是否需要加载新图片（列表宽度不会变）
                    WaterFall.valid_toInsert();

                resize_n = 0;

            }, 0);
        });

    },

    // 判断是否需要插入新单元，并执行
    valid_toInsert: function() {
        var scrollTop_px = this.paras.listener_scroll_obj.scrollTop();
        if (WaterFall.column_shortest_height_min_px + WaterFall.box_top_px - scrollTop_px < WaterFall.window_height_px) {
            if (WaterFall.item_inserting)
                return;
            WaterFall.item_inserting = true;
            WaterFall.insert_item();
        }
    },

    // 装载项目单元
    insert_item: function() {

        WaterFall.item_inserting = true;

        var datalist = WaterFall.paras.datalist;
        var box_obj = $(WaterFall.paras.box_selector);

        if (!WaterFall.column_height_px) {
            WaterFall.column_height_px = [];
            var i = 0;
            var len = WaterFall.column_count;
            for (; i < len; i++)
                WaterFall.column_height_px[i] = 0;
        }
        var column_height = WaterFall.column_height_px; // 数组，记录每列高度

        var insert = function() {

            var scrollTop_px = $(window).scrollTop(); // 窗口滚动高度

            // console.log(scrollTop_px);

            // 如超出了数据长度，则结束
            if (++WaterFall.insert_n >= datalist.length) {
                if (WaterFall.paras.callback_all_success) {
                    WaterFall.paras.callback_all_success();
                    WaterFall.paras.callback_all_success = null;
                }
                if (WaterFall.paras.callback_none_success && datalist.length === 0)
                    WaterFall.paras.callback_none_success();
                WaterFall.item_inserting = false;
                WaterFall.window_scroll_listen = false;
                return;
            }

            // console.log(WaterFall.insert_n);

            // 获得最短的列的序号，0开始
            var column_shortest = (function() {
                var _column = 0;
                var _column_height = column_height[0];
                var i = 1;
                for (; i < WaterFall.column_count; i++) {
                    if (column_height[i] < _column_height) {
                        _column_height = column_height[i];
                        _column = i;
                    }
                }
                return _column;
            })();

            // console.log(WaterFall.insert_n);
            // console.log(column_shortest);
            // console.log(column_height);

            // 获得新单元的top
            var top_px = column_height[column_shortest] + (column_height[column_shortest] === 0 ? WaterFall.paras.line_first_top : WaterFall.paras.line_top);
            // console.log(top_px);

            // 获得新单元的left
            var left_px = column_shortest === 0 ? WaterFall.paras.column_first_left :
                WaterFall.paras.column_first_left +
                column_shortest * (WaterFall.paras.column_left + WaterFall.paras.item_width);

            // 插入新单元
            if (WaterFall.paras.data_template) {
                var _obj = WaterFall.paras.datalist[WaterFall.insert_n];
                var _str = WaterFall.paras.data_template;
                var reg;
                for (var key in _obj) {
                    reg = new RegExp("\\{\\$data-" + key + "\\}", "g");
                    // eval("reg = /\\{\\$data-" + key + "\\}/g;");
                    _str = _str.replace(reg, _obj[key]);
                }
                box_obj.append(_str);
            } else {
                box_obj.append(datalist[WaterFall.insert_n]);
            }

            // console.log(WaterFall.insert_n);

            // 找到新单元
            var item_obj = $(WaterFall.paras.box_selector + " " + WaterFall.paras.item_selector);
            item_obj = $(item_obj[item_obj.length - 1]);

            // 装载JSON内容到新单元
            if (WaterFall.paras.data_template && WaterFall.insert_n === 0) {}

            // 定位新单元位置
            item_obj.addClass("c" + column_shortest)
                .css("top", top_px + "px")
                .css("left", left_px + "px")
                .css("width", WaterFall.paras.item_width + "px")
                .css("position", "absolute")
                .find("img").css("width", "100%");

            // 找到新单元中的图片对象
            var img_obj = $(item_obj.find("img"));
            var img_obj_len = img_obj.length;

            // 图片加载完成后的执行方法
            var img_obj_loaded = function() {

                // console.log(WaterFall.insert_n + ":" + item_obj.height() + "px");

                // 累加列高度
                WaterFall.column_height_px[column_shortest] = column_height[column_shortest] = top_px + item_obj.height();

                // 累加盒高度并改变盒样式
                // console.log(column_height[column_shortest] + ":" + WaterFall.box_height_px + ":" + box_obj.height());
                if (column_height[column_shortest] > WaterFall.box_height_px) {
                    WaterFall.box_height_px = column_height[column_shortest];
                    box_obj.css("height", WaterFall.box_height_px + "px");
                }

                // 执行插入成功回调
                if (WaterFall.paras.callback_item_success)
                    WaterFall.paras.callback_item_success(item_obj);

                // 判断是否结束回调

                // 获得窗口滚动高度
                scrollTop_px = $(window).scrollTop();

                // 获得最短的列的高度
                var column_shortest_px = WaterFall.column_shortest_height_min_px = (function() {
                    var shortest_px = column_height[0];
                    var i = 1;
                    for (; i < WaterFall.column_count; i++) {
                        if (column_height[i] < shortest_px) {
                            shortest_px = column_height[i];
                            WaterFall.column_shortest_height_min_px = shortest_px - item_obj.height();
                        }
                    }
                    return shortest_px;
                })();

                // 判断最短的列是否超过窗口底线
                if ((column_shortest_px + WaterFall.box_top_px) > (WaterFall.window_height_px + scrollTop_px)) {
                    if (WaterFall.paras.callback_all_success) {
                        WaterFall.paras.callback_all_success();
                        WaterFall.paras.callback_all_success = null;
                    }
                    // 重置window.scroll监听
                    WaterFall.item_inserting = false;
                    WaterFall.window_scroll();
                    // 重置window.resize监听
                    WaterFall.window_resize_listen = true;
                    WaterFall.window_resize();
                    return;
                }

                // 结束判断

                // 插入下一个项目
                insert();

            };

            // 如果不含图片，调用加载完成方法
            if (img_obj_len === 0)
                img_obj_loaded();

            // 监听图片加载
            var img_load_n = 0;
            var img_loaded = function() {
                if (++img_load_n == img_obj_len)
                    img_obj_loaded();
            };
            var preload = function() {
                return function(src) {
                    var _img = new Image();
                    _img.src = src;
                    // console.log(WaterFall.insert_n + ":" + _img.src);
                    if (_img.complete) {
                        img_loaded();
                    } else {
                        _img.onload = function() {
                            img_loaded();
                        };
                    }
                };
            }();
            for (i = 0; i < img_obj_len; i++) {
                preload($(img_obj[i]).prop("src"));

            }

        };

        insert();

    },

    // 重计算 列数量
    resize_item: function() {

        // 重获窗口高度
        WaterFall.window_height_px = $(window).height();

        // 获得外盒top
        WaterFall.box_top_px = $(WaterFall.paras.box_selector).offset().top;

        // 计算盒宽度
        WaterFall.box_width_px = $(WaterFall.paras.box_selector).width();

        // 计算盒减首列后宽度
        var _box_width_px_temp = WaterFall.box_width_px - WaterFall.paras.column_first_left - WaterFall.paras.item_width;

        // 计算除首列外列数
        var _column_count_temp = parseInt(_box_width_px_temp / (WaterFall.paras.column_left + WaterFall.paras.item_width));

        // 计算总列数
        WaterFall.column_count = _column_count_temp + 1;
        if (WaterFall.column_count < WaterFall.paras.item_min)
            WaterFall.column_count = WaterFall.paras.item_min;
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return WaterFall;
    });
}
