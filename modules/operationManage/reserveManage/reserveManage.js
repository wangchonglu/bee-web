/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {

    //dot数据模板
    var doT=require("doT");
    require("JsHelper");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    /*页面事件*/
    var events = {
        common:function(){
            //产品点击事件
            $(".reserve-main").on("click", ".product-item", function () {
                var team=require("./team");
                team.init();
            });

            //所有产品预约产品事件
            $(".reserve-main").on("click", ".allProReserve", function () {
                var reserveList=require("./reserveList");
                reserveList.init("0");
            });

            //面包屑：所有产品入口
            $(".reserve-main").on("click", ".nav-bar-product", function () {
                actions.init();
            });
        }
    };

    var render={
        toPage:function(){
            var data=[
                {
                    id:"1001",
                    name:"恒宇天泽投资基金1"
                },
                {
                    id:"1002",
                    name:"恒宇天泽投资基金2"
                },
                {
                    id:"1003",
                    name:"恒宇天泽投资基金3"
                },
                {
                    id:"1004",
                    name:"恒宇天泽投资基金4"
                },
                {
                    id:"1005",
                    name:"恒宇天泽投资基金5"
                },
                {
                    id:"1006",
                    name:"恒宇天泽投资基金6"
                },
                {
                    id:"1007",
                    name:"恒宇天泽投资基金7"
                },
                {
                    id:"1008",
                    name:"恒宇天泽投资基金8"
                }
            ];
            require("./css/productList.css");
            var html=require("./tpl/productList.html");
            html =doT.template(html)(data);
            $("#menu_content").html(html);
            $(".reserve-product").css("min-height",$("#menu_navigate").height()-65);
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