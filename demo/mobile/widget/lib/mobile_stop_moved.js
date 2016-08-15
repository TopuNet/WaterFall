// 2.0.6
var mobile_stop_moved = {
    /*
        opt:{
            selector: "", // 容器盒选择器（resize_toWindow为false时，需要在样式表中将此盒定高），无默认值
            scroll: true, // 盒内可滚动，默认true
            resize_toWindow: true // 将容器盒自动设置为有效窗口高度(window.innerHeight)，并监听窗口大小改变——解决ios safari浏览器底部工具栏遮挡页面的问题，默认true
        }
    */
    init: function(opt) {
        var opt_default = {
            selector: "",
            scroll: true,
            resize_toWindow: true
        }
        opt = $.extend(opt_default, opt);

        // 默认阻止
        $(document).on("touchmove", function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        if (opt.scroll) {

            var obj = $(opt.selector);
            obj.css("overflow", "scroll").css("-webkit-overflow-scrolling", "touch").css("overflow-scrolling", "touch");
            var clientY_start;

            $(document).on("touchstart", function(e) {
                var touches = e.touches || e.originalEvent.touches;
                clientY_start = touches[0].clientY;
            });

            $(document).unbind("touchmove").on("touchmove", function(e) {

                var scrollHeight = obj[0].scrollHeight; // 盒内内容实际滚动高度
                var offsetHeight = obj.height(); // 盒高度
                var scrollTop = obj.scrollTop(); // 盒内内容已滚动高度
                var touches = e.touches || e.originalEvent.touches;
                var clientY_now = touches[0].clientY;
                var canScroll = true;

                var neednt = offsetHeight >= scrollHeight; // 不需要滚动（盒高度>=盒内容高度）
                var topest = scrollTop == 0 && clientY_now > clientY_start; // 本身在页首，还往下拉动页面
                var bottemest = scrollHeight <= (scrollTop + offsetHeight) && clientY_now < clientY_start; // 本身在页尾，还往上拉动页面

                if (neednt || topest || bottemest) {
                    canScroll = false;
                }

                if (!canScroll) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        if (opt.resize_toWindow) {
            var resize_n = 0;
            var resize_do = function() {
                if (++resize_n % 2 == 0)
                    return;
                setTimeout(function() {
                    $(opt.selector).css("height", window.innerHeight);
                    resize_n = 0;
                }, 0);
            }

            resize_do();

            $(window).resize(function() {
                resize_do();
            });
        }
    }
};

if (typeof define === "function" && define.amd) {
    define([], function() {
        return mobile_stop_moved;
    });
}
