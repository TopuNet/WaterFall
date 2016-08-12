# 瀑布流插件 v1.0.1
### 安装：npm install TopuNet-WaterWall

文件结构：
-------------

		1. WaterWall.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中

页面引用：
-------------

原生引用：

		1. 页面底端引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.min.js
		2. 后引用 /jq/WaterWall.js

requireJS引用：
        
        2. 依赖WaterWall.js和(jquery.min.js#1.x 或 zepto.min.js)，成功后返回对象WaterWall


功能配置及启用：
--------------

初始化：

		var WaterFall_para = {
            listener_scroll_selector: "section.wrap", // 监听滚动的选择器。默认window，移动端使用mobile_stop_moved模块时，可以设置为最外盒
            box_selector: "section.list", // 项目单元外盒选择器。无默认值。移动端使用时，需设置 position: relative;
            item_width: 243, // 项目单元宽度。不包含列间距。无默认值
            line_top: 22, // 行 上间距。默认0
            line_first_top: 11, // 第一行 上间距。默认0
            column_left: 16, // 列 左间距。默认0
            column_first_left: 29, // 第一列 左间距。默认0
            unit: "px", // 宽高单位 "px|vw", 默认px。且重置窗口大小时，vw不重新计算对应的px
            item_min: 2, // 最小列数，默认1。
            ps: 40, // 每页显示数量。默认50（5×10）
            data_template: null, // 项目单元模板字符串。不传此参数，则项目单元直接装载datalist；传此参数，则datalist需要传入json对象，按键名替换模板中的${data-key}。
            datalist: null, // 项目单元内容。支持字符串数组或JSON对象。JSON对象需配合data_template使用
            resize_window_resize_column_number: true, // 改变窗口大小时，重新计算列宽度（清空所有项目单元并重新加载，耗资源），默认false
            callback_item_success: function(_item_obj) { // 项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值
                console.log("项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值");
            },
            callback_all_success: function() { // 成功回调。无默认值
                console.log("成功回调。无默认值");
            },
            callback_none_success: function() { // 0数据行成功回调（没有数据）。无默认值
                console.log("0数据行成功回调（没有数据）。无默认值");
            }
        };

		WaterFall.init(WaterFall_para);

重载/插入 项目单元：

		var paras = {
			datalist: WaterFall_para.datalist,
			clear_box: true // 是否清空已有项目单元
		};

		WaterFall.insert_items_list(paras);


功能说明及注意事项：
--------------

1. 支持移动端和pc端使用。
        
        移动端一般会配合mobile_stop_moved模块，将listener_scroll_selector设为最外盒的选择器，并将box_selector对应的盒设置样式 position: relative;

2. unit可选"px|vw"

        vw的原理为将所有传递的长度参数在初始化的时候转回px。但在resize时不重新计算（图片不会随着窗口变小而变小）。

3. 支持字符串和JSON对象两种传参方式

        字符串形式：

        {
            // 其他参数，无data_template //

            datalist: [
                "<div class=\"list_item\"><img src=\"/images/0.jpg\" /></div>"
                ,"<div class=\"list_item\"><img src=\"/images/1.jpg\" /></div>"
            ]
        }

        JSON形式：

        {
            // 其他参数 //

            data_template: "<div class=\"list_item\"><img src=\"{$data-img}\" /><p style=\"text-align:center\">{$data-serial}</p></div>",
            datalist: [
                {
                    img: "/images/0.jpg",
                    serial: "0"
                },
                {
                    img: "/images/1.jpg",
                    serial: "1"
                }
            ]
        }


更新记录：
--------------

v1.0.1

        创建项目并发布
        