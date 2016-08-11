/*
	白梦超
	20160718
	滑动图片验证码
	v 1.0.1
*/

//参数设置方法
/*
var opt = {
    div_width: 260,//设置大图的默认宽
    div_height: 160,//设置大图的默认高
    crop_div: 50, // 设置移动的小图片的宽高
    valid_range: 5, // 图片验证正确的容错范围，默认是5
    unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
    background_url: [], // 大图路径，数组
    Callback_error: function() { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove();
    	pic_code.doMove();
    }, 
    Callback_error_repeatedly: function() { // 多次验证失败回调，优先于Callback_error  默认事件pic_code.change_background_url();
    	pic_code.change_background_url();
    }, 
    Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
    Callback_success: function() { //验证成功回调，默认方法：pic_code.valid_success_callback()	
    	pic_code.valid_success_callback();
    }
}
*/

var pic_code = {
	dom_obj : {
		oPicCode: $('pic_code'),	//验证码最外面一层
        oCircle: $('.circle'),  	//点击的圆圈
        oLine: $('.line'),			//圆圈后面的线
        oLineBao: $('.line_bao'),	//圆圈和线的父级层
        oPic: $('.pic'),			//大图的容器
        oPicBao: $('.pic_bao'),		//大图和刷新按钮父级层
        oRef: $('.refresh'),		//刷新按钮
        oSuccess: $('.success'),	//验证成功的显示层
        oPicMask: $('.pic_mask'),	//验证失败的遮罩层
        oPicLoad: $('.pic_loading')	//图片加载时等待
    },
    params : {
    	left_begin: 5,	//设置小块初始位置距左侧的距离
    	agent : window.navigator.userAgent.indexOf('MSIE 6.0')!=-1 || window.navigator.userAgent.indexOf('MSIE 7.0')!=-1 || window.navigator.userAgent.indexOf('MSIE 8.0')!=-1  //浏览器是ie6,7,8此值为true，否则为false
    },
    _opt : null,
    init : function(opt){
    	//设置默认参数
    	var t_opt = {
    		div_width: 260,//设置大图的默认宽
		    div_height: 160,//设置大图的默认高
		    crop_div: 50, // 设置移动的小图片的宽高
		    valid_range: 5, // 图片验证正确的容错范围，默认是5
		    unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
		    background_url: [], // 大图路径，数组
		    Callback_error: function() { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove(oDiv2);
		    	pic_code.doMove();
		    }, 
		    Callback_error_repeatedly: function() { // 多次验证失败回调，优先于Callback_error  默认事件pic_code.change_background_url();
		    	pic_code.change_background_url();
		    }, 
		    Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
		    Callback_success: function() { //验证成功回调，默认方法：pic_code.valid_success_callback()	
		    	pic_code.valid_success_callback();
		    }
		}

        //在html头部引入验证码样式表
        var  link = $('<link href="/inc/pic_code.css" rel="stylesheet" type="text/css" />');
        $($('head')[0]).append(link);


		pic_code._opt = $.extend(t_opt, opt);
		//ie6,7,8,不支持vw，强制使用px
		if(pic_code.params.agent){
        	pic_code._opt.unit = 'px';
        }
		//记录验证错误的次数
		var pic_code_error_count=0;
		//设置样式
		pic_code.set_style()
		//进入页面换张图
		pic_code.change_background_url();
		//监听 刷新验证码按钮 点击事件
		pic_code.oRef_click()
    },
    //设置样式
    set_style : function(){
    	var company=pic_code._opt.unit;
    	pic_code.dom_obj.oPicCode.css('width',pic_code._opt.div_width+company);
    	pic_code.dom_obj.oPicBao.css('width',pic_code._opt.div_width+company);
    	pic_code.dom_obj.oLine.css('width',pic_code._opt.div_width+company);
    	pic_code.dom_obj.oSuccess.css('width',pic_code._opt.div_width+company);
    	pic_code.dom_obj.oPic.css({'width':pic_code._opt.div_width+company,'height':pic_code._opt.div_height+company});
    	pic_code.dom_obj.oPicMask.css({'width':pic_code._opt.div_width+company,'height':pic_code._opt.div_height+company});
    	//加载等待的样式
    	pic_code.dom_obj.oPicLoad.css({'width':pic_code._opt.div_width+company,'height':pic_code._opt.div_height+company});
    	pic_code.dom_obj.oPicLoad.find('img').css({'width':pic_code._opt.div_width+company,'height':pic_code._opt.div_height+company});
    },
    // 换大图
    change_background_url: function() {
    	pic_code_error_count=0;
    	pic_code.dom_obj.oCircle.css('left','0px');
    	pic_code.dom_obj.oLine.html('按住左边滑块，拖动完成上方拼图');
    	pic_code.delateDiv();
    	pic_code.dom_obj.oPicLoad.css('display','block');
        var img = new Image();
        var pic_len=pic_code._opt.background_url.length-1
        img.src = pic_code._opt.background_url[rnd(0,pic_len)];

        var img_complete = function() {
        	pic_code.dom_obj.oPicLoad.css('display','none');
        	pic_code.dom_obj.oPic.find('img').attr('src', img.src);   
        	pic_code.dom_obj.oPic.find('img').css({'width':pic_code._opt.div_width+pic_code._opt.unit,'height':pic_code._opt.div_height+pic_code._opt.unit});   
        	pic_code.create_div(); 
        	pic_code.oCircle_Click();
        }

        if (img.complete) {
            img_complete();
        } else {
            img.onload = function() {  	
                img_complete();
            }
        }
    },

    //验证失败小块滑回原位
    doMove : function(){
    	pic_code.dom_obj.oCircle.animate({'left':'0px'},1000);
    	$('.pic_code .pic_bao div').eq(3).animate({'left':pic_code.params.left_begin+'px'},1000);
		pic_code.dom_obj.oLine.html('按住左边滑块，拖动完成上方拼图');
    	setTimeout(function(){
    		pic_code.oCircle_Click();
    	},1000)
    },

    //验证成功的默认回调
    valid_success_callback : function(){
    	pic_code.dom_obj.oSuccess.css('display','block');
        pic_code.dom_obj.oLineBao.css('display','none');
        pic_code.dom_obj.oRef.css('display','none');
    },


    // 监听 滑块点击和拖动
    oCircle_Click: function() {
        pic_code.dom_obj.oCircle.on('mousedown touchstart',function(event){
        	//获取两个小块
        	var oDiv1=$('.pic_code .pic_bao div').eq(2);
        	var oDiv2=$('.pic_code .pic_bao div').eq(3);
        	var oD_left=parseInt(oDiv1.css('left'));
        	var disX=event.clientX-parseInt(oDiv2.css('left')) || event.originalEvent.changedTouches[0].pageX-parseInt(oDiv2.css('left'));
        	//圆滑块的最大left值
        	var oL_max_px=parseInt(pic_code.dom_obj.oLine.css('width'))-parseInt(pic_code.dom_obj.oCircle.css('width'));
        	//可动的小块的最大leftzhi
        	var oDiv2_left_max_px=parseInt(pic_code.dom_obj.oPic.css('width'))-parseInt(oDiv2.css('width'))-pic_code.params.left_begin;
        	$(document).on('mousemove touchmove',function(event){
        		var oL=event.clientX-disX || event.originalEvent.changedTouches[0].pageX-disX;
        		if (oL>=10){
        			pic_code.dom_obj.oLine.html('');
        		}else {
        			pic_code.dom_obj.oLine.html('按住左边滑块，拖动完成上方拼图');
        		}
        		
        		if (oL<=0){
        			oL=0;
        		}else if (oL>=oL_max_px){
        			oL=oL_max_px;
        		}
    			
        		pic_code.dom_obj.oCircle.css('left',oL+'px');

        		oDiv2.css('left',(oL/oL_max_px*oDiv2_left_max_px+pic_code.params.left_begin)+'px');
        	})
        	$(document).on('mouseup touchend',function(){
        		//验证成功的操作
        		if(Math.abs(parseInt(oDiv2.css('left'))-oD_left)<=pic_code._opt.valid_range){
        			pic_code._opt.Callback_success&&pic_code._opt.Callback_success()
        			
        		}
        		//验证失败的操作
        		else {
        			pic_code_error_count+=1;
        			console.log(pic_code_error_count)
        			pic_code.dom_obj.oCircle.unbind('mousedown touchstart');
        			pic_code.dom_obj.oPicMask.css('display','block');
        			setTimeout(function(){
        				pic_code.dom_obj.oPicMask.css('display','none');
        				
        				if (pic_code_error_count==pic_code._opt.Callback_error_repeatedly_count){
        					pic_code._opt.Callback_error_repeatedly();
        				}else {
        					pic_code._opt.Callback_error();
        				}
        			},1000)		
        		}
        		$(document).unbind('mousemove touchmove');
        		$(document).unbind('mouseup touchend');	
        	})
        	return false;
        })
    },

    // 监听 刷新验证码按钮 点击事件
    oRef_click: function() {
        pic_code.dom_obj.oRef.click(function(){
        	pic_code.delateDiv();
        	pic_code.change_background_url();
        	pic_code.oCircle_Click();
        })
    },

    // 创建小块
    create_div: function() {
        var oDiv1=$('<div></div>');
        var oDiv2=$('<div></div>');
        oDiv1.appendTo(pic_code.dom_obj.oPicBao);
        oDiv2.appendTo(pic_code.dom_obj.oPicBao);
        var oD_left = rnd(pic_code._opt.crop_div,pic_code._opt.div_width-pic_code._opt.crop_div);
        var oD_top = rnd(5, pic_code._opt.div_height-pic_code._opt.crop_div-5);
        oDiv1.css({'width':pic_code._opt.crop_div+pic_code._opt.unit,'height':pic_code._opt.crop_div+pic_code._opt.unit,'position' : 'absolute','left':oD_left+pic_code._opt.unit,'top' : oD_top+pic_code._opt.unit , 'background' : '#fff', 'box-shadow' : '0px 0px 2px 2px #000 inset'})
       
        oDiv2.css({'width':pic_code._opt.crop_div+pic_code._opt.unit,'height':pic_code._opt.crop_div+pic_code._opt.unit,'position' : 'absolute','left': pic_code.params.left_begin+'px','top':oD_top+pic_code._opt.unit});
  		oDiv2.css({'background':'url('+pic_code.dom_obj.oPic.find('img').attr('src')+')','background-position':'-'+oD_left+pic_code._opt.unit+' -'+oD_top+pic_code._opt.unit,'background-size':pic_code._opt.div_width+pic_code._opt.unit+' '+pic_code._opt.div_height+pic_code._opt.unit,'box-shadow' : '0px 0px 3px 3px yellow inset,0px 0px 3px 3px #000'})
  		if(pic_code.params.agent){
        	oDiv1.css('border','solid 1px #000')
        	oDiv2.css('border','solid 1px #fff')
        }
    },

    // 删除小块
    delateDiv: function() {
        var len = $('.pic_code .pic_bao div').length;
        for (var i = len; i > 1; i--) {
            $('.pic_code .pic_bao div').eq(i).remove();
        }
    }
};


if (typeof define === "function" && define.amd) {
    define([], function() {
        return pic_code;
    });
}

//返回一个m到n之间的随机数
function rnd(m,n){
	return parseInt(Math.random()*(m-n)+n);
}


