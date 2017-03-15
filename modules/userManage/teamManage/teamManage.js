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
            $(".team_manage").on("click", ".op_add_team", function () {
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
                            var gName = $(".teamName").val();
                            invokeServer.createGroup(gName, function (data) {
                                if (data.status == 0) {
                                    //给公海池设置管理员
                                    var adminor = $(".adminName").attr("data-val");
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
                    var $setAdmin = $(".adminName");
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
                    validate = $(".create_team_pop input").simpleValidate();
                });
            });

            //添加员工
            $(".team_manage").on("click", ".op_addmember", function () {
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
                var $addUser = $(".userName"), $addDept = $(".deptName");
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

                                        $(".add_user_pop .all_users").append(nodeTemp);
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
        }
    };

    /*渲染页面*/
    var render = {
        toPage: function () {
            invokeServer.getSeaDetail(function (data) {
                var index = -1;
                for (var i = 0; i < data.userList.length; i++) {
                    if (data.userList[i].name.indexOf("默认分组") >= 0) {
                        index = i;
                        break;
                    }
                }
                if(index!=-1){
                    data.userList.splice(index, 1);
                }
                var htmlTpl = require("./tpl/index.html");
                var html = doT.template(htmlTpl)(data.userList);
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