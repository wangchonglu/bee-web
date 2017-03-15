/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    var cache={
        users:[],
        PageData:[]
    };

    var events={
        common:function(){
            $(".team-member").find(".trUserLeads").off("click").on("click",function(){
                var id =$(this).attr("data-uid");
                invokeServer.getUserLeads(id,1,10,function(data){
                    require("./css/unassigned.css");
                    var temp =require("./tpl/unassigned.html");
                    cache.PageData=data.info.body.leads;
                    temp=doT.template(temp)(data.info.body.leads);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "线索详情",
                        content: temp,
                        width: 1000,
                        height: 400,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                        }
                    });
                    $(".cfyPopuplay_body").css({
                        "padding":"0px",
                        "margin-bottom":"20px"
                    });
                    $(".cfyPopuplay_body .leads_unassigned").css("width","100%");

                    $(".cfyPopuplay_body .leads_unassigned_pager").customPager({
                        curPage: 1,
                        allCount: data.info.body.pageCount,
                        bindData: function (index, displayCount, maxCount) {
                            events.pager(id,index,displayCount);
                        }
                    });
                    events.click();
                });
            });
        },
        pager:function(id,index,displayCount){
            invokeServer.getUserLeads(id,index,displayCount,function(data){
                var temp =require("./tpl/unassignedPager.html");
                temp=doT.template(temp)(data.info.body.leads);
                $(".cfyPopuplay_body .leads_unassigned").find("tbody").hide(300,function(){
                    $(this).html(temp).fadeIn(300);
                });
            });

        },
        click:function(){
            $(".cfyPopuplay_body .leads_unassigned").find(".trData").off("click").on("click",function(){
                var gid =$(this).attr("data-gid");
                var currentData=cache.PageData.filter(function(item){
                    return item.id==gid;
                });
                var data=[
                    {name:"名称",value:currentData[0].name},
                    {name:"手机",value:currentData[0].phone},
                    {name:"邮箱",value:currentData[0].email},
                    {name:"职位",value:currentData[0].post},
                    {name:"公司名称",value:currentData[0].companyName},
                    {name:"地址",value:currentData[0].address},
                    {name:"状态",value:currentData[0].status},
                    {name:"来源",value:currentData[0].dbcVarchar2},
                    {name:"批次",value:currentData[0].dbcVarchar4},
                    {name:"说明/备注",value:currentData[0].comment},
                    {name:"最近活动时间",value:isNullOrEmpty(currentData[0].recentActivityRecordTime)==true?"":getSmpFormatDate(new Date(currentData[0].recentActivityRecordTime), true)},
                    {name:"创建时间",value:isNullOrEmpty(currentData[0].createdAt)==true?"":getSmpFormatDate(new Date(currentData[0].createdAt), true)}
                ];
                var viewDetail = require("./viewDetail");
                viewDetail.show(data);
            });
        }
    };

    //获取数据
    var dataActions={
        getData:function(tid,callback){
            //根据团队id获取团队具体信息
            invokeServer.getTeamMemberInfo(tid,function(userData){
                cache.users=userData.userList;
                callback(cache.users);
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        }
    };

    //flag是否为管理员
    var buildHtml=function(data,flag,$target){
        require("./css/teamMember.css");
        var temp =require("./tpl/teamMember.html");
        var html=doT.template(temp)(data);
        if(flag==true){
            //加载弹出层
            require("simpleShowDialog");
            $(window).simpleShowDialog({
                title: "团队人员线索详情",
                content: html,
                width: 600,
                height: 400,
                actions: ["submit", "cancel"],
                onSubmit: function () {
                }
            });
        }else{
            $target.html(html);
        }
        events.common();
    };

    //用户操作
    var actions={
        toPage:function(index,dispCount,tid,flag,$target){
            dataActions.getData(tid,function(data){
                buildHtml(data,flag,$target);
            });
        }
    };

    module.exports = actions;
});