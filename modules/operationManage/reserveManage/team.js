/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {

    //dot数据模板
    var doT=require("doT");
    require("JsHelper");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //异步加载预约列表js
    var reserveList;
    require.async("./reserveList",function(res){
        reserveList=res;
    });

    /*页面事件*/
    var events = {
        common:function(){
            //查看某团队所有预约点击事件
            $(".reserve-team").on("click", ".teamDetail", function () {
                reserveList.init("2");
            });

            //当前产品所有预约 点击事件
            $(".reserve-team").on("click", ".singleProReserve", function () {
                reserveList.init("1");
            });

            //面包屑：所有团队入口
            $(".reserve-main").on("click", ".nav-bar-team", function () {
                actions.init();
            });
        }
    };

    var render={
        toPage:function(){
            $(".header .all").hide();
            $(".nav-bar ul").html('<li><a href="javascript:void(0)" class="nav-bar-res">预约管理&gt;</a> </li><li><a href="javascript:void(0)" class="nav-bar-product">所有预约产品&gt;</a></li><li>所有团队预约</li>');

            var data=[
                {
                    name:"周立团队一",
                    amount:"100万",
                    assignAmount:"200万",
                    count:"15",
                    allPrice:"3000万"
                },
                {
                    name:"周立团队二",
                    amount:"100万",
                    assignAmount:"200万",
                    count:"15",
                    allPrice:"3000万"
                },
                {
                    name:"周立团队三",
                    amount:"100万",
                    assignAmount:"200万",
                    count:"15",
                    allPrice:"3000万"
                },
                {
                    name:"周立团队四",
                    amount:"100万",
                    assignAmount:"200万",
                    count:"15",
                    allPrice:"3000万"
                }

            ];
            require("./css/team.css");
            var html=require("./tpl/team.html");
            html =doT.template(html)(data);
            $(".reserve-part").html(html);
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