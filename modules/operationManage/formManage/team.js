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
    var formList;
    require.async("./formList",function(res){
        formList=res;
    });

    /*页面事件*/
    var events = {
        common:function(){
            //查看某团队所有预约点击事件
            $(".form-team").on("click", ".teamDetail", function () {
                formList.init("2");
            });

            //当前产品所有预约 点击事件
            $(".form-team").on("click", ".singleProForm", function () {
                formList.init("1");
            });

            //面包屑：所有团队入口
            $(".form-main").on("click", ".nav-bar-team", function () {
                actions.init();
            });
        }
    };

    var render={
        toPage:function(){
            $(".form-main .all").hide();
            $(".form-main .nav-bar").html('<ul><li><a href="javascript:void(0)">报单管理&gt;</a> </li><li><a href="javascript:void(0)" class="nav-bar-product">所有报单产品&gt;</a></li><li>所有团队报单</li></ul>');

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
                }
            ];
            require("./css/team.css");
            var html=require("./tpl/team.html");
            html =doT.template(html)(data);
            $(".form-part").html(html);
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