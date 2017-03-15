/**
 * Created by Moment on 2015/8/21.
 */
define(function (require, exports, module) {
    var doT = require("doT");
    require("./jsHelper");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //引用企业通讯录接口  引用组织架构接口
    var enterContact, orgStructure;
    require.async(["enterpriseContacts", "orgStructure"], function (enter, org) {
        enterContact = enter;
        orgStructure = org;
    });

    //Cache
    var cacheData = {
        //存储页面渲染数据
        leads: {},
        //存储每个团队的人员信息
        teamGroup: []
    };

    var events = {
        common: function () {
            //自定义分配线索给团队
            $(".leads_pool").on("click", ".customAssign", function () {
                var leadsAllCount = cacheData.leads.seaData.uncaimedCount;
                require.async(["./tpl/popAvg.html", "./css/avgPopTable.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)({ all: leadsAllCount, groups: cacheData.leads.groups,isTeam:true });
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "自定义分配",
                        content: html,
                        width: 500,
                        height: 400,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            return leadsAction.customAssign();
                        }
                    });

                    //绑定平均分配事件
                    leadsAction.calAvgCount();
                });
            });

            //导入线索
            $(".leads_pool").on("click", ".importLeads", function () {
                //加载弹出层
                require.async(["./tpl/importLeads.html", "./css/importLeads.css", "./csv"], function (html, css, csv) {
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "导入线索",
                        content: html,
                        width: 500,
                        height: 300,
                        //isShowAction:false,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //importLeads();
                            //return false;
                            var isSuccess;
                            var fileInput = document.getElementById('leadInput');
                            csv.importLeads(fileInput, function (data) {
                                data.splice(0, 1);
                                var leads = { "leads": data };
                                invokeServer.importLead(cacheData.leads.seaData.id, leads, function (data) {
                                    alert("导入线索成功！");
                                    actions.init();
                                    //$(".message").html("导入线索成功！");
                                    //isSuccess = true;
                                }, function (error) {
                                    alert("导入线索失败！");
                                    //$(".message").html("导入线索失败！");
                                    //isSuccess = false;
                                });
                            }, function (errormessage) {
                                //$(".message").html(errormessage);
                               //isSuccess = false;
                            });
                            return true;
                        }
                    });
                });
            });


        }
    };

    /*线索处理*/
    var leadsAction={
        calAvgCount:function(){
            //平均分配线索给团队
            $(".lead_pool_avg").on("click", ".avgAssign", function () {
                var allNumber = cacheData.leads.seaData.uncaimedCount;
                if ($(".assignCount").val() != "") {
                    allNumber = Number($(".assignCount").val());
                }
                //当前线索团队的个数
                var length = cacheData.leads.groups.length;
                var avg = parseInt(allNumber / length);
                var rail = parseInt(allNumber % length);
                $(".cfyLeadTeam").each(function (i, item) {
                    if (rail > 0) {
                        $(item).val(avg + 1);
                        rail--;
                    }
                    else {
                        $(item).val(avg);
                    }
                });
            });
        },
        customAssign:function(){
            var leadsAllCount=cacheData.leads.seaData.uncaimedCount;
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
                invokeServer.getLeadsPoolList(cacheData.leads.seaData.id, 1, item.count, 2, function (data) {
                    if ($.isArray(data.leads.records)) {
                        var leadIds = data.leads.records.superJoin(',');
                        invokeServer.assignLeadsToUser(item.gid, leadIds, function (req) {
                            //重新加载页面
                            render.toPage();
                        }, function (error) {
                            alert("error");
                        });
                    }
                });
            });
            return true;
        },
        importLeads:function(){
            var date = new Date();
            var se = date.getSeconds();
            //目前用来测试创建线索
            var leads = {
                "leads": [
                    {
                        "tags": "asdf",
                        "post": "asdf",
                        "dbcVarchar1": "asdf",
                        "email": "asdf",
                        "dbcVarchar3": "asdf",
                        "dbcVarchar2": "asdf",
                        "name": "asdf",
                        "comment": "asdf",
                        "companyName": "asfd",
                        "mobile": "432000" + se
                    }
                ]
            };
            invokeServer.importLead(cacheData.leads.seaData.id, leads, function (data) {
                alert(JSON.stringify(data));
            }, function (error) {
                alert(JSON.stringify(error));
            });
        }

    };

    /*渲染页面*/
    var render = {
        toPage: function () {
            invokeServer.getSeaDetail(function (data) {
                if($.isArray(data.userList) && data.userList.length>0){
                    var seaData=data.userList[0];
                    //根据团队id获取团队具体信息
                    invokeServer.getTeamMemberInfo(data.userList[0].id,function(userData){
                        var obj = { seaData: seaData, groups: userData.userList };
                        cacheData.leads = obj;
                        var htmlTpl = require("./tpl/teamLeader/index.html");
                        var html = doT.template(htmlTpl)(obj);
                        require("./css/teamLeader/index.css");
                        $("#menu_content").html(html);
                        //注册事件
                        events.common();
                    }, function (error) {
                        //处理加载数据出错
                        $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                    });
                }
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        }
    };

    //初始化，加载数据 这里需要调用接口
    var actions = {
        init: function () {
            render.toPage();
        }
    };

    module.exports = actions;
});