/**
 * Created by chonglu.wang on 2015/9/10.
 */
define(function (require, exports, module) {
    var doT = require("doT");

    var invokeServer = require("./business");

    //加载等待弹出层
    var waitloading=require("waitloading");

    var cache={
        isAdmin:undefined,
        //公司线索池
        companyPool:{},
        //团队线索池
        currentTeamPool:{},
        //团队分组列表
        teamPoolList:[],
        Count:{
            remain:"",
            assigned:"",
            garbage:""
        }
    };

    //根据角色获取公司线索池信息或者当前团队的信息
    var leadsAction={
        getPoolInfo:function(isAdmin,callback){
            //这里异步请求数据
            invokeServer.getSeaDetail(function (data) {
                if(isAdmin==true){
                    //获取公司线索池的id
                    var index = 0;
                    var allCount=0;
                    for (var i = 0; i < data.userList.length; i++) {
                        if (data.userList[i].name.indexOf("默认分组") >= 0) {
                            index = i;
                        }
                        allCount=allCount+data.userList[i].allCount;
                    }
                    cache.companyPool = data.userList.splice(index, 1)[0];
                    cache.teamPoolList=data.userList;
                    cache.currentTeamPool = cache.companyPool;
                    cache.allCount=allCount;

                }else{
                    //这里是选择当前团队线索公海池分组
                    cache.currentTeamPool = data.userList[0];
                }
                callback();

            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        },
        updateCount:function(){
            //修改title
            $(".allotCount").text(cache.allCount);
            invokeServer.getGarbageLead(cache.currentTeamPool.id,1,10,function(data){
                //修改title
                $(".garCount").text(data.info.dataCount);

            });
        }
    };

    var actions = {

        init: function () {
            //线索管理页面初始化
            var leadBodyTpl = require("./tpl/main.html");
            var leadBody = doT.template(leadBodyTpl)(null);
            //右边内容DIV
            var $content = $("#menu_content");
            $content.html(leadBody);
            waitloading.show($(".unassign-content"));

            //获取当前登录人是否为管理员角色
            var isAdmin=invokeServer.checkRole();
            cache.isAdmin=isAdmin;

            var unassigned=require("./unassigned");
            leadsAction.getPoolInfo(isAdmin,function(){

                leadsAction.updateCount();

                unassigned.toPage(cache,$(".unassign-content"));
            });


            //引入jquery.tabslet插件  并且 初始化插件
            require.async(["jqueryTabs","./css/tabs.css"], function () {
                $('.leadsTabs').tabslet().on({"_before":function(event){
                    var type=$(event.target).find("a").attr("href");
                    if(type=="#undistributedLeads"){
                        //var unassigned=require("./unassigned");
                        unassigned.toPage(cache,$(".unassign-content"));

                    }else if(type=="#allocatedLeads"){
                        var assigned=require("./assigned");
                        assigned.toPage(cache,$(type));

                    }else if(type=="#garbageLeads"){
                        var garbageLeads=require("./garbageLeads");
                        garbageLeads.toPage($(type),cache);
                    }

                }});
            });


        }
    };

    module.exports = actions;
});