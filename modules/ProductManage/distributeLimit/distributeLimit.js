/**
 * 提供团队分配产品销售额度的模块
 * Created by chonglu.wang on 2015/9/28.
 */
define(function (require, exports, module) {

    var actions = {
        showDistributeBox: function (productInfo) {


            //分配团队销售额度
            require.async(["doT","./tpl/main.html", "./css/main.css"], function (doT,tpl) {
                var html = doT.template(tpl)(null);
                //加载弹出层
                require("simpleShowDialog");
                $(window).simpleShowDialog({
                    title: "分配团队额度",
                    content: html,
                    width: 600,
                    height: 500,
                    actions: ["submit", "cancel"],
                    onSubmit: function () {
                        return false;
                    }
                });
            });
        }
    };



    module.exports = actions;

});
