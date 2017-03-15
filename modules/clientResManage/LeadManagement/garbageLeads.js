/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");
    var invokeServer = require("./business");

    var cache={};

    var events={
        common:function(){
            //点击数据行查看
            $(".leads_garbage").on("click",".trData", function () {
                var gid=$(this).attr("data-gid");
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
                    {name:"丢弃原因",value:currentData[0].errorReason},
                    {name:"最近活动时间",value:isNullOrEmpty(currentData[0].recentActivityRecordTime)==true?"":getSmpFormatDate(new Date(currentData[0].recentActivityRecordTime), true)},
                    {name:"创建时间",value:isNullOrEmpty(currentData[0].createdAt)==true?"":getSmpFormatDate(new Date(currentData[0].createdAt), true)}
                ];
                var viewDetail = require("./viewDetail");
                viewDetail.show(data);

            });
        }
    };

    var buildHtml=function($target,data,flag){
        require("./css/garbageLeads.css");
        var temp="";
        if(flag==0){
            temp =require("./tpl/garbageLeads.html");
            temp=doT.template(temp)(data);
            $target.html(temp);
        }else if(flag==1){
            temp =require("./tpl/garbagePager.html");
            temp=doT.template(temp)(data);
            $target.hide(300,function(){
                $(this).html(temp).fadeIn(300);
            });
        }

    };

    var render={
        toPage:function($target,info){
            //缓存线索数据
            cache=info;
            //这里异步请求数据
            invokeServer.getGarbageLead(cache.currentTeamPool.id,1,10,function(data){
                cache.PageData=data.info.records;
                buildHtml($target,data.info.records,0);

                //修改title
                $(".garCount").text(data.info.dataCount);


                require("PagerPath/customPager");
                $(".leads_garbage_pager").customPager({
                    curPage: 1,
                    allCount:data.info.pageCount,
                    bindData: function (index, displayCount, maxCount) {
                        render.toTable(index,displayCount);
                    }
                });

                events.common();
            });
        },
        toTable:function(index, displayCount){
            //这里异步请求数据
            invokeServer.getGarbageLead(cache.currentTeamPool.id,index,displayCount,function(data){
                cache.PageData=data.info.records;
                buildHtml($(".leads_garbage tbody"),data.info.records,1);
            });
        }
    };

    module.exports = render;
});