/**
 * Created by Moment on 2015/8/21.
 */
define(function (require, exports, module) {
    var doT = require("doT");

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
                    var html = doT.template(conTem)({ all: leadsAllCount, groups: cacheData.leads.groups });
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

            //创建团队
            $(".leads_pool").on("click", ".createTeam", function () {
                var validate;

                require.async(["./css/createTeam.css", "./tpl/createTeam.html"], function (css, tempHtml) {
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "创建团队",
                        content: tempHtml,
                        width: 450,
                        height: 300,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var gName = $("#lead_create_team").val();
                            invokeServer.createGroup(gName, function (data) {
                                if (data.status == 0) {
                                    //给公海池设置管理员
                                    var adminor = $("#set_admin").attr("data-val");
                                    invokeServer.setGroupAdmin(adminor, data.id, function (data) {
                                        render.toPage();
                                    });
                                    return true;
                                }
                            }, function (error) {
                                return false;
                            });
                        }
                    });

                    //加载自动完成控件 绑定通讯录人员数据
                    var $setAdmin = $("#set_admin");
                    require.async(["autoCompletePath/autoComplete", "enterpriseContacts"], function (autoComplete, enterpriseContacts) {
                        enterpriseContacts.getContactsInfo(function (data) {
                            if (data.status == 0) {
                                if ($.isArray(data.allUsers)) {
                                    var dataA = [];
                                    $.each(data.allUsers, function (i, item) {
                                        var info = { name: item.name, phone: item.telphone };
                                        dataA.push(info);
                                    });
                                    $setAdmin.autoComplete({
                                        data: dataA,
                                        request: {
                                            url: "",
                                            type: "",
                                            data: ""
                                        },
                                        textField: "name",
                                        valueField: "phone",
                                        callback: function (retval, items, $this) {

                                        }
                                    });
                                }
                            }
                        }, null);
                    });

                    //加载验证插件 并注册需要验证的输入框
                    require("formValidation");
                    validate = $(".lead_create_team_pop input").simpleValidate();
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
                            var isSuccess;
                            var fileInput = document.getElementById('leadInput');
                            csv.importLeads(fileInput, function (data) {
                                data.splice(0, 1);
                                var leads = { "leads": data };
                                invokeServer.importLead(cacheData.leads.seaData.id, leads, function (data) {
                                    alert("导入线索成功！");
                                    actions.init();
                                    //$(".message").html("导入线索成功！");
                                    isSuccess = true;
                                }, function (error) {
                                    alert("导入线索失败！");
                                    //$(".message").html("导入线索失败！");
                                    isSuccess = false;
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

            //添加员工
            $(".leads_pool").on("click", ".op_addmember", function () {
                //这里需要获取组ID
                $thisGroup = $(this).parent().parent();
                //当前组分配人员数组
                var assignUsers = [];
                //分配部门时：部门用户数组
                var assignDeptUsers = [];

                require("./css/addUser.css");
                var html = require("./tpl/addUser.html");
                //加载弹出层
                require("simpleShowDialog");
                $(window).simpleShowDialog({
                    title: "添加人员",
                    content: html,
                    width: 500,
                    height: 350,
                    actions: ["submit", "cancel"],
                    onSubmit: function () {
                        var count = assignUsers.length;
                        var uids = assignUsers.join(',');
                        if (assignDeptUsers.length > 0) {
                            var deptUsers = assignDeptUsers.superJoin(',');
                            if (!isNullOrEmpty(uids)) {
                                uids = uids + "," + deptUsers;
                            } else {
                                uids = deptUsers;
                            }
                            count = assignUsers.length + assignDeptUsers.length;
                        }
                        var gid = $thisGroup.attr("data-gid");

                        invokeServer.assignGroupMember(uids, gid, function (data) {
                            render.toPage();
                            //更改表格成员数目
                            //$thisGroup.find(".member").text(Number($thisGroup.find(".member").text())+count);
                            return true;
                        }, function (error) {
                            return false;
                        });
                    }
                });

                //绑定自动完成控件
                var $addUser = $("#lead_add_user"), $addDept = $("#lead_add_dept");
                require.async("autoCompletePath/autoComplete", function (autoComplete) {
                    enterContact.getContactsInfo(function (data) {
                        var dataA = [];
                        if ($.isArray(data.allUsers)) {
                            $.each(data.allUsers, function (i, item) {
                                var info = { name: item.name, uid: item.uid };
                                dataA.push(info);
                            });
                            $addUser.autoComplete({
                                data: dataA,
                                request: {
                                    url: "",
                                    type: "",
                                    data: ""
                                },
                                textField: "name",
                                valueField: "uid",
                                callback: function (retval, items, $this) {
                                    //假如当前用户存在，则不重复添加
                                    if (assignUsers.indexOf(retval.value) == -1) {
                                        assignUsers.push(retval.value);
                                        var nodeTemp = '<div class="user_node"><div class="user" data-uid="{0}">{1}</div><div class="delete" title="删除">X</div></div>'.format(retval.value, retval.title);

                                        $(".lead_add_user_pop .lead_users").append(nodeTemp);
                                    }
                                    //绑定删除事件
                                    $("body .cfyPopuplay").on("click", ".delete", function () {
                                        var uid = $(this).parent().find(".user").attr("data-uid");
                                        $(this).parent().fadeOut(300, function () {
                                            $(this).remove();
                                            var index = assignUsers.indexOf(uid);
                                            assignUsers.splice(index, 1);
                                        });
                                    });
                                }
                            });
                        }
                    });
                    orgStructure.getDeptList(function (deptArrayInfo) {
                        if ($.isArray(deptArrayInfo)) {
                            var dataA = [];
                            $.each(deptArrayInfo, function (i, item) {
                                var info = { deptName: item.name, deptId: item.id };
                                dataA.push(info);
                            });
                            $addDept.autoComplete({
                                data: dataA,
                                request: {
                                    url: "",
                                    type: "",
                                    data: ""
                                },
                                textField: "deptName",
                                valueField: "deptId",
                                callback: function (retval, items, $this) {
                                    var deptId = $this.attr("data-val");
                                    orgStructure.getDepartUsers(deptId, function (data) {
                                        if (data.status == 0) {
                                            assignDeptUsers = data.info.records;
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });

            //查看线索详情
            $(".leads_pool").on("click", ".view_detail", function () {
                var seaId=cacheData.leads.seaData.id;
                var detail=require("./leadsDetail");
                detail.init(seaId);
            });


            /*
             //详情信息
             $("body").on("click", ".leads_pool .op_detail", function () {
             //这里需要获取组ID
             $thisGroup=$(this).parent().parent();
             var gid=$thisGroup.attr("data-gid");
             require("./css/detail.css");
             var html=require("./tpl/detail.html");
             var data=teamGroup.filter(function(item){
             return item.id==gid;
             });
             html=doT.template(html)(data[0]);
             //加载弹出层
             require("simpleShowDialog");
             $(window).simpleShowDialog({
             title: "线索详情",
             content: html,
             width:500,
             height:450,
             actions:["submit"],
             onSubmit:function(){

             }
             });

             });
             */
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
                        invokeServer.assignLeadsToGroup(item.gid, leadIds, function (req) {

                        }, function (error) {
                            alert("error");
                        });
                    }
                });
            });
            //重新加载页面
            render.toPage();
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
                var index = 0;
                for (var i = 0; i < data.userList.length; i++) {
                    if (data.userList[i].name.indexOf("默认分组") >= 0) {
                        index = i;
                        break;
                    }
                }
                var seaData = data.userList.splice(index, 1);
                //渲染主页面，团队信息
                var obj = { seaData: seaData[0], groups: data.userList };
                cacheData.leads = obj;
                var htmlTpl = require("./tpl/index.html");
                var html = doT.template(htmlTpl)(obj);
                require("./css/index.css");
                $("#menu_content").html(html);
                //注册事件
                events.common();
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