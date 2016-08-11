# 瀑布流插件 v1.0.1
### 安装：待发布

文件结构：
-------------

		1. WaterWall.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中

页面引用：
-------------

原生引用：

		1. 页面底端引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.js
		2. 后引用 /jq/WaterWall.js

requireJS引用：
        
        2. WaterWall.js和(jquery.min.js#1.x 或 zepto.js)，成功后返回对象WaterWall


功能配置及启用：
--------------

初始化：

		$(function() {
			var WaterFall_para = {
                box_selector: "section.list", // 瀑布流外盒选择器。无默认值
                item_selector: "div.list_item", // 项目单元选择器。必须存在于box内。无默认值
                item_width: 243, // 项目单元宽度。不包含列间距。无默认值
                line_top: 22, // 行 上间距。默认0
                line_first_top: 11, // 第一行 上间距。默认0
                column_left: 16, // 列 左间距。默认0
                column_first_left: 29, // 第一列 左间距。默认0
                unit: "px", // 宽高单位 "px|vw", 默认px。且重置窗口大小时，不重新转换
                item_min: 2, // 最小列数，默认1。
                ps: 80, // 每页显示数量。默认50（5×10）
                datalist: ["<div class=\"list_item\"><img src=\"/images/0.jpg\" /></div>","<div class=\"list_item\"><img src=\"/images/1.jpg\" /></div>"], // 单元内容字符串数组
                resize_window_resize_column_number: true, // 改变窗口大小时，重新计算列宽度（清空所有项目单元并重新加载），默认true
                callback_item_success: function(_item_obj) { // 项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值
                    console.log("项目单元成功插入回调 _item_obj: 新插入的单元对象。无默认值");
                },
                callback_all_success: function() { // 成功回调。无默认值
                    console.log("成功回调。无默认值");
                },
                callback_none_success: function() { // 0数据行成功回调（没有数据）。无默认值
                    console.log("0数据行成功回调（没有数据）。无默认值");
                }
            }
	    });

		WaterFall.init(WaterFall_para);

重载/插入 项目单元：

		var paras = {
			datalist: WaterFall_para.datalist,
			clear_box: true // 是否清空已有项目单元
		};

		WaterFall.insert_items_list(paras);

