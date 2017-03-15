/**
 * Created by Moment on 2015/8/4.
 */
define(function (require, exports, module) {
    //��������Ӻ���
    var action = {
        show:function($target){
            $target.html("");
            $target.append("<div class='wait_loading'><div class='wait_img'><img src='./modules/foundation/image/wait_loading.gif' /></div></div>");
        },
        showback : function(){
            if($("body").find('#lightPopup').length==0){
                var htmlTpl = require("./tpl/popupLayer.html");
                require("./css/popupLayer.css");
                $("body").append(htmlTpl);
            }
            var imgHtml = "<img class='wait_loading' src='./modules/foundation/image/wait_loading.gif' />";
            $('#lightPopup').html(imgHtml);
            $('.white_content').css("border", "none");
            $('.white_content').css("box-shadow", "none");
            $('.white_content').css("top", "48%");
            $('.white_content').css("left", "48%");
            $('#lightPopup').fadeIn();
            $('#fadePopup').fadeIn();
        },
        hide : function(){
            $('#lightPopup').fadeOut();
            $('#fadePopup').fadeOut();
        }
    };

    module.exports = action;
});
