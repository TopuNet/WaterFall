


define(["lib/zepto.min"], function() {
    var page_name = $("#script_page").attr("page");
    switch (page_name) {
        case "demo_string":
            require(["app/demo_string"], function($obj) {
                $obj.init();
            });
            break;
        case "demo_json":
            require(["app/demo_json"], function($obj) {
                $obj.init();
            });
            break;
    };
});
