/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {

    //dot数据模板
    var doT=require("doT");
    //require("JsHelper");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    /*页面事件*/
    var events = {
        common:function(){
            //产品点击事件
            $(".form-main").on("click", ".product-item", function () {
                var team=require("./team");
                team.init();
            });

            //所有产品预约产品事件
            $(".form-main").on("click", ".allProForm", function () {
                var formList=require("./formList");
                formList.init("0");
            });

            //面包屑：所有产品入口
            $(".form-main").on("click", ".nav-bar-product", function () {
                actions.init();
            });
        }
    };

    var render={
        toPage:function(){
            var data=[
                {
                    id:"1001",
                    name:"短融保1号"
                },
                {
                    id:"1002",
                    name:"短融保2号"
                },
                {
                    id:"1003",
                    name:"短融保3号"
                },
                {
                    id:"1004",
                    name:"短融保4号"
                },
                {
                    id:"1005",
                    name:"短融保4号"
                }
            ];
            require("./css/productList.css");
            var html=require("./tpl/productList.html");
            html =doT.template(html)(data);
            $("#menu_content").html(html);
            $(".form-product").css("min-height",$("#menu_navigate").height()-65);
            events.common();
        }
    };

    var actions = {
        init:function(){
            render.toPage();
        }
    };

    module.exports=actions;

});