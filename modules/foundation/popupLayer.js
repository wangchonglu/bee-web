/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //给弹出层加函数
    var action = {
        show : function(content){
            if($("body").find('#lightPopup').length==0){
                var htmlTpl = require("./tpl/popupLayer.html");
                require("./css/popupLayer.css");
                $("body").append(htmlTpl);
            }
            $('#lightPopup').html(content);
            $('.white_content').css("border","1px solid gray");
            $('.white_content').css("box-shadow","0 0 10px 0 #0cc");
            $('.white_content').css("top","25%");
            $('.white_content').css("left","35%");
            $('#lightPopup').fadeIn(700);
            $('#fadePopup').fadeIn(700);
        },
        hide : function(){
            $('#lightPopup').fadeOut();
            $('#fadePopup').fadeOut();
        }
    };

    module.exports = action;
});
