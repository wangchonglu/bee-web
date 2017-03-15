/**
 * Created by Moment on 2015/9/15.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //操作
    var actions={
        show:function(data){
            require.async(["./tpl/viewDetail.html", "./css/viewDetail.css"], function (conTem, conCss) {
                var html = doT.template(conTem)(data);
                //加载弹出层
                require("simpleShowDialog");
                $(window).simpleShowDialog({
                    title: "线索详情",
                    content: html,
                    width: 650,
                    height: 630,
                    actions: ["close"],
                    onSubmit: function () {
                        return true;
                    }
                });
            });
        }
    };

    module.exports = actions;
});