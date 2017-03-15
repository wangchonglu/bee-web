/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //加载工具类js函数
    require("JsHelper");

    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");

    var invokeServer = require("./business");

    var cache={
        PageData:[],
        //公司线索池
        companyPool:{},
        info:{},
        batchList:[]
    };

    var events={
        page:function(){
            //导入线索
            $("#undistributedLeads").find(".importLeads").off("click").on("click",function () {
                var validate;
                //加载弹出层
                require.async(["./tpl/importLeads.html", "./css/importLeads.css"], function (html, css) {
                   require("simpleShowDialog");
                   $(window).simpleShowDialog({
                       title: "导入线索",
                       content: html,
                       width: 600,
                       height: 500,
                       isShowAction:false,
                       actions: ["submit", "cancel"],
                       onSubmit: function () {
                           return true;
                       }
                   });

                    batchActions.build();

                    //绑定事件
                    events.common();

                   //加载验证插件 并注册需要验证的输入框
                   validate = $(".lead_import_pop input").simpleValidate();
               });


           });

            //自定义分配线索给团队
            $("#undistributedLeads").find(".assignLeads").off("click").on("click", function () {
               var leadsAllCount = $(".undisCount").text();
               require.async(["./tpl/popAvg.html", "./css/importLeads.css"], function (conTem, conCss) {
                   var html = doT.template(conTem)({ all: leadsAllCount, groups: cache.info.teamPoolList });
                   var height=cache.info.teamPoolList.length*60+200;
                   if(height>650){height=650;}
                   //加载弹出层
                   require("simpleShowDialog");
                   $(window).simpleShowDialog({
                       title: "自定义分配",
                       content: html,
                       width: 600,
                       height: height,
                       actions: ["submit", "cancel"],
                       onSubmit: function () {
                           return leadsAction.customAssign();
                       }
                   });
                   $(".lead_pool_avg th").css("width","28%");
                   $(".lead_pool_avg .assignCount").css("width","58px");

                   //绑定平均分配事件
                   events.common();
               });
           });

            //点击数据行查看
            $("#undistributedLeads").find(".trData").off("click").on("click",function () {
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
                    {name:"最近活动时间",value:isNullOrEmpty(currentData[0].recentActivityRecordTime)==true?"":getSmpFormatDate(new Date(currentData[0].recentActivityRecordTime), true)},
                    {name:"创建时间",value:isNullOrEmpty(currentData[0].createdAt)==true?"":getSmpFormatDate(new Date(currentData[0].createdAt), true)}
                ];
                var viewDetail = require("./viewDetail");
                viewDetail.show(data);

            });
       },
        common:function(){
            //平均分配线索给团队
            $(".lead_pool_avg").on("click", ".avgAssign", function () {
                var allNumber = $(".undisCount").text();
                if ($(".assignCount").val() != "") {
                    allNumber = Number($(".assignCount").val());
                }
                //当前线索团队的个数
                var length = cache.info.teamPoolList.length;
                var avg = parseInt(allNumber / length);
                var rail = parseInt(allNumber % length);
                $(".cfyLeadTeam").each(function (i, item) {
                    if (rail > 0) {
                        $(item).val(avg + 1);
                        rail--;
                    }else {
                        $(item).val(avg);
                    }
                });
            });

            //开始导入线索
            $(".lead_import_pop").on("click", ".startImport", function () {
                var validate=$(".lead_import_pop input").simpleValidate();
                //提交验证
                if (!validate.formValidate()) {
                    return false;
                }
                var source = $(".lead_import_pop .importSource").val();
                var batch = $(".lead_import_pop .importBatch").val();
                var remark = $(".lead_import_pop .importRemark").val();

                //$(".cfyPopuplay_close").get(0).click();
            });
        }
    };

    /*线索处理*/
    var leadsAction={
        customAssign:function(){
            var leadsAllCount=4;
            var groupInfo = [];
            var total = 0;
            //提取组ID 和 分配线索数
            $(".cfyLeadTeam").each(function (i, item) {
                if (!isNullOrEmpty($(item).val())) {
                    var count = Number($(item).val());
                    if (count !== 0) {
                        total = total + count;
                        var gid = $(item).attr("data-gid");
                        groupInfo.push({ gid: gid, count: count });
                    }
                }
            });
            if (total > leadsAllCount) {
                alert("总分配数不能超过总线索数");
                return false;
            }
            //对每个组分配线索
            $.each(groupInfo, function (index, item) {
                //invokeServer.getLeadsPoolList(cacheData.leads.seaData.id, 1, item.count, 2, function (data) {
                //    if ($.isArray(data.leads.records)) {
                //        var leadIds = data.leads.records.superJoin(',');
                //        invokeServer.assignLeadsToGroup(item.gid, leadIds, function (req) {
                //
                //        }, function (error) {
                //            alert("error");
                //        });
                //    }
                //});
            });
            //重新加载页面
            render.toPage();
            return true;
        }
    };

    var buildHtml=function($target,data,flag){
        require("./css/unassigned.css");
        var temp ="";
        // 0:整个页面，1:分页模板
        if(flag==0){
            temp =require("./tpl/unassigned.html");
            temp=doT.template(temp)(data);
            $target.html(temp);
        }else if(flag==1){
            temp =require("./tpl/unassignedPager.html");
            temp=doT.template(temp)(data);
            $target.find("tbody").hide(300,function(){
                $(this).html(temp).fadeIn(300);
            });
        }
    };

    //批次管理
    var batchActions={
        build:function(){
            $(".lead_import_pop .sddSource").width($(".lead_import_pop .sddInput").width());
            var html='';

            $.each(cache.batchList,function(index,item){
                html+='<li class="sddItem" value="{0}">{1}</li>'.format(item.batch_id,item.batch_name);
            });
            $(".lead_import_pop .sddul1").append(html);
            batchActions.events();
        },
        events:function(){
            $(".lead_import_pop").on("click",".sddImg,.sddText",function(event){
                var $tar=$(".lead_import_pop .sddSource");
                if($tar.is(":visible")){
                    $tar.hide();
                }else{
                    $tar.show();
                }
                event.stopPropagation();
            });

            $(".lead_import_pop").on("click",".sddItem",function(){
                var $text=$(".lead_import_pop .sddText");
                $text.text($(this).text());
                $text.attr("data-id",$(this).attr("value"));
                $(".lead_import_pop .sddSource").hide();
                event.stopPropagation();
            });

            $(".lead_import_pop").on("click",".addbatch",function(){
                var validate;
                var temp=require("./tpl/addBatch.html");
                //加载弹出层
                $(window).simpleShowDialog({
                    title: "添加批次",
                    content: temp,
                    width: 520,
                    height: 360,
                    actions: ["submit", "cancel"],
                    onSubmit: function () {
                        //提交验证
                        if (!validate.formValidate()) {
                            return false;
                        }
                        var name=$(".batchName").val();
                        var source=$(".batchSource").val();
                        var comment=$(".batchComment").val();
                        invokeServer.createBatch(name,source,comment,function(data){
                            $(".lead_import_pop .sddul1").append('<li class="sddItem" value="{0}">{1}</li>'.format(data.bid,name));
                            cache.batchList.push({batch_id: data.bid, batch_name: name, comment: comment, source: source});
                        });
                        return true;
                    }
                });
                $(".lead_batch_pop th").css("width","28%");
                //加载验证插件 并注册需要验证的输入框
                validate = $(".lead_batch_pop input").simpleValidate();
            });

            $(document).bind('click',function(){
                $(".lead_import_pop .sddSource").hide();
            });
        },
        getBatchList:function(){
            invokeServer.batchList(function(data){
                cache.batchList=data.batchs;
            });
        }
    };

    var render={
        toPage:function(info,$target){

            //这里异步请求数据 根据线索池id
            cache.companyPool=info.currentTeamPool;
            cache.info=info;

            //0表示未分配
            invokeServer.getLeadsPoolList(info.currentTeamPool.id,1,10,0,function(obj){
                var data=obj.leads.records;
                cache.PageData=obj.leads.records;
                buildHtml($target,data,0);

                //修改title
                $(".undisCount").text(obj.leads.dataCount);
                //禁用分配线索按钮
                if(obj.leads.dataCount==0){
                    $(".assignLeads").prop("disabled","disabled");
                    $(".assignLeads").removeClass("hoverBtn");
                    $(".assignLeads").css({
                        "background-color":"#dcdcdc"
                    });
                }
                require("simpleSearch");
                $(".leads_search").simpleSearch({
                    searchField:[
                        //{value:"source",text:"来源"},
                        {value:"batch",text:"批次"}
                    ],
                    callback:function(value,keyword){
                        alert(value+keyword);
                    }
                });

                require("PagerPath/customPager");
                $(".leads_unassigned_pager").customPager({
                    curPage: 1,
                    allCount: obj.leads.pageCount,
                    bindData: function (index, displayCount, maxCount) {
                        render.toTable($target,index,displayCount);
                    }
                });

                //绑定事件
                events.page();
            },function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });

            //获取批次列表
            batchActions.getBatchList();
        },
        toTable:function($target,index, displayCount){
            invokeServer.getLeadsPoolList(cache.companyPool.id,index,displayCount,0,function(obj){
                cache.PageData=obj.leads.records;
                buildHtml($target,obj.leads.records,1);
            });
        }
    };

    module.exports = render;
});