/*
 *@ 1.1.3
 *@ 高京
 *@ 20151009
 *@ 判断是否竖屏，横屏自动出黑屏动画
 */
var landscape_mask = {

    init: function() {

        // 加载样式
        landscape_mask.includeCSS("/inc/landscape_mask.min.css");

        // 动态增加遮罩DOM
        var tag_str = "<section class=\"landscape_mask\">" + "<div class=\"mod_div\">" + "<img src=\"/inc/landscape_mask.png\" />" + "<p>为了更好的体验，请使用竖屏浏览</p>" + "</div>" + "</section>";
        $("body").append(tag_str);

        var _selector = $("section.landscape_mask");

        $("p.a").html("0");

        // 发生屏幕旋转和打开页面时，重置遮罩层高度
        var changeDo = function() {

            var window_height_px = $(window).height();

            _selector.css("height", window_height_px + "px");

            $("p.a").html($("p.a").html() + "<br />32:" + window.orientation);
        };

        // 监听窗口大小改变（安卓弹出软键盘时，也会触发）
        var resize_n = 0;
        $(window).resize(function() {
            // 如果当前屏幕朝向等于0，则隐藏遮罩，并return（屏蔽安卓input获得焦点后的resize）。
            // 如朝向不为0，则显示遮罩，并先使所有input,select失去焦点（收起软键盘）后，再重置遮罩层高度
            $("p.a").html($("p.a").html() + "<br />39:window-" + window.orientation);
            if (window.orientation == 0) {
                _selector.removeClass("landscape_mask_show");
                return;
            } else if(!_selector.hasClass("landscape_mask_show"))
                _selector.addClass("landscape_mask_show");

            $("input,select").blur();
            if (resize_n++ > 0)
                return;
            setTimeout(function() {
                changeDo();
                resize_n = 0;
            }, 0);
        });
    },

    includeCSS: function(path) {
        var a = document.createElement("link");
        a.type = "text/css";
        a.rel = "stylesheet";
        a.href = path;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(a);
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return landscape_mask;
    })
} else
    landscape_mask.init();
