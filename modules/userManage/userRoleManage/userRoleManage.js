/**
 * Created by Moment on 2015/8/6.
 */
define(function (require, exports, module) {
    /*dot数据模板*/
    var doT = require("doT");
    /*调用远程服务器获取数据*/
    var invokeServer = require("./business");
    /*查询数据的时候转圈*/
    var Loading = require("../../../modules/foundation/waitloading");
    /*缓存*/
    var cache = {
        /*当前页用户信息*/
        PageUser: {},
        /*存储所有角色*/
        Roles: [],
        /*存储员工UID,Name*/
        SimpleStaff: []
    };

    /*页面绑定事件*/
    var events = {
        detail: function () {
            /*详情页面*/
            $(".userRoleManage").on("click", ".table-detail", function () {
                var $tr = $(this).parent().parent();
                var uid = $tr.attr("data-uid");
                var roleName = $tr.find(".role_role").text();
                var curUser = cache.PageUser.filter(function (item) {
                    return item.uid == uid;
                });
                curUser[0].roleName = roleName;
                curUser[0].email = !!curUser[0].email ? curUser[0].email : "";
                curUser[0].dep_name = !!curUser[0].dep_name ? curUser[0].dep_name : "";
                curUser[0].head_img = !!curUser[0].head_img ? curUser[0].head_img : "";
                var trRoles = $tr.find(".role_role").text();
                var bindData = [];
                $.each(cache.Roles, function (index, item) {
                    if (trRoles.indexOf(item.name) >= 0) {
                        bindData.push({id: item.id, name: item.name, checked: true});
                    } else {
                        bindData.push({id: item.id, name: item.name, checked: false});
                    }
                });
                var jsonObj = {addOrEdit: 0, roles: bindData};

                var detail = {currUser: curUser[0], jsonObj: jsonObj};

                require.async(["./tpl/detail.html", "./css/detail.css", "./css/allot.css"], function (conTem, conCss, allotCss) {
                    var html = doT.template(conTem)(detail);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "角色分配",
                        content: html,
                        width: 550,
                        height: 400,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            var uid = $tr.attr("data-uid");
                            var roles = "";
                            $(".roleCheckBox").each(function (index, item) {
                                if ($(item).prop("checked")) {
                                    roles = roles + $(item).attr("data-id") + ",";
                                }
                            });
                            //更新用户角色
                            roleActions.update(uid, roles.replace(/\,$/, ""));
                            return true;
                        }
                    });

                });
            });
        },
        update: function () {
            /*修改角色*/
            $(".userRoleManage").on("click", ".table-allot", function () {
                var $tr = $(this).parent().parent();
                var trRoles = $tr.find(".role_role").text();
                var bindData = [];
                $.each(cache.Roles, function (index, item) {
                    if (trRoles.indexOf(item.name) >= 0) {
                        bindData.push({id: item.id, name: item.name, checked: true});
                    } else {
                        bindData.push({id: item.id, name: item.name, checked: false});
                    }
                });
                var jsonObj = {addOrEdit: 0, roles: bindData};
                require.async(["doT", "./tpl/allot.html", "./css/allot.css"], function (doT, conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "修改角色",
                        content: html,
                        width: 400,
                        height: 300,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            var uid = $tr.attr("data-uid");
                            var roles = "";
                            $(".roleCheckBox").each(function (index, item) {
                                if ($(item).prop("checked")) {
                                    roles = roles + $(item).attr("data-id") + ",";
                                }
                            });
                            //更新用户角色
                            roleActions.update(uid, roles.replace(/\,$/, ""));
                            return true;
                        }
                    });
                });
            });
        },
        add: function () {
            /*分配用户角色*/
            $(".userRoleManage").on("click", ".adds", function () {
                require.async(["./tpl/adds.html", "./css/adds.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)(cache.Roles);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "分配新用户角色",
                        content: html,
                        width: 450,
                        height: 230,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //这里调用添加员工接口
                            var uid = $("#role_add_input").attr("data-val");
                            if (facilities.isNullOrEmpty(uid)) {
                                return false;
                            }
                            var role = $(".role_add_content .role_select").val();
                            var curRole = cache.Roles.filter(function (item) {
                                return item.name == role;
                            });
                            var roleId = curRole[0].id;
                            invokeServer.UpdateUserRole(uid, roleId, function (data) {
                                actions.init();
                                return true;
                            });
                        }
                    });

                    //加载自动完成控件 绑定通讯录人员数据
                    var $roleAdd = $("#role_add_input");
                    require("autoCompletePath/autoComplete");
                    userActions.getUser(function (data) {
                        $roleAdd.autoComplete({
                            data: data,
                            request: {url: "", type: "", data: ""},
                            textField: "name",
                            valueField: "uid",
                            callback: function (retval, items, $this) {
                            }
                        });
                    });

                });
            });
        },
        delete: function () {
            /*删除人员*/
            $(".userRoleManage").on('click', ".table-delete", function () {
                if (confirm("你确定删除吗？")) {
                    //获取到当前角色
                    var $tr = $(this).parent().parent();
                    var uid = $tr.attr("data-uid");
                    invokeServer.UpdateUserRole(uid, "", function (data) {
                        //actions.init();
                        $tr.fadeOut(1000, function () {
                            $(this).remove();
                        });
                    });
                }
            });
        },
        select: function () {
            $(".table-nav-option").on("click", ".op_role_search_img", function () {
                var name = $("#searchUserName").val();
                name = !!name ? name : "";
                var borderWidth = $(".undistributed-user").css("borderWidth");
                borderWidth = !!borderWidth ? borderWidth : "";
                if (borderWidth.split("p")[0] > 0) {
                    render.toTable(name, false, 1, 10, 2);
                } else {
                    render.toTable(name, true, 1, 10, 2);
                }
            });
        },
        //加载页面时给菜单DIV[已分配角色][未分配角色]添加点击事件
        bindMenuClass: function () {
            var name = $(".search-centent #searchUserName").val() == undefined ? "" : $(".search-centent #searchUserName").val();
            //未分配
            $(".undistributed-user").click(function () {
                //显示加载中图片
                Loading.show($(".table-page"));
                //name:name,false:表示未分配,1:第一页，10：显示个数，2：认证的用户，0：表示tab切换
                render.toPage(name, false, 1, 10, 2,0);

                $(this).css({
                    "position": "relative",
                    "border": "#E7E7E7 solid 1px",
                    "border-bottom": "0px",
                    "background-color": "#fff"
                });
                $(".assigned-user").css({
                    "background-color": "#e3eaf9",
                    "top": "0px",
                    "border": "0px"
                });
                //$(".table-page").css({"border": "darkgray solid 1px"});

                $(".table-page .beeWebTable").find('th').eq(2).css("display", "none");
                $(".table-page .beeWebTable").find('.role_role').css("display", "none");
                //$(this).addClass("assigned-active");
                //$(".assigned-user").addClass("assigned-noactive");
            });

            //已分配
            $(".assigned-user").click(function () {
                //显示加载中图片
                Loading.show($(".table-page"));
                render.toPage(name, true, 1, 10, 2,0);

                $(this).css({
                    "position": "relative",
                    "border": "#E7E7E7 solid 1px",
                    "border-bottom": "0px",
                    "background-color":"#fff"
                });
                //$(".table-page").css({"border": "darkgray solid 1px"});
                $(".undistributed-user").css({
                    "top": "0px",
                    "border": "0px",
                    "background-color": "#E3EAF9"
                });

                //$(this).addClass("assigned-active");
                //$(".undistributed-user").addClass("assigned-noactive");
            });
        }
    };

    /*角色操作*/
    var roleActions = {
        update: function (uid, roleids) {
            invokeServer.UpdateUserRole(uid, roleids, function (data) {
                actions.init();
            });
        },
        parseIdToName: function (roleids) {
            var names = "";
            $.each(cache.Roles, function (index, item) {
                if (roleids.indexOf(item.id) >= 0) {
                    if (item.name == "租户管理员") {
                        item.name = "公司管理员";
                    }
                    names = names + item.name + ",";
                }
            });
            return names.replace(/\,$/, "");
        },
        parseNameToId: function (names) {
            var ids = "";
            $.each(cache.Roles, function (index, item) {
                if (names.indexOf(item.name) >= 0) {
                    ids = ids + item.id + ",";
                }
            });
            return ids.replace(/\,$/, "");
        },
        joinByid: function (array, value) {
            var ids = "";
            for (var i = 0, n = array.length; i < n; i++) {
                ids = ids + array[i].id + value;
            }
            ids = ids.substr(0, ids.length - 1);
            return ids;
        },
        checkRoleId: function (roleid, roles) {
            if (facilities.isNullOrEmpty(roleid)) {
                roleid = "";
            }
            var result = roles.filter(function (item) {
                return roleid.indexOf(item.id) >= 0;
            });
            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    };

    /*用户管理*/
    var userActions = {
        getUser: function (callback) {
            if (cache.SimpleStaff.length <= 0) {
                var contacts = require("enterpriseContacts");
                contacts.getContactsInfo(function (data) {
                    if ($.isArray(data.allUsers)) {
                        var dataA = [];
                        $.each(data.allUsers, function (i, item) {
                            if (!roleActions.checkRoleId(item.role_ids, cache.Roles)) {
                                var info = {name: item.name, uid: item.uid};
                                dataA.push(info);
                            }
                        });
                        cache.SimpleStaff = dataA;
                        callback(cache.SimpleStaff);
                    }
                });
            } else {
                callback(cache.SimpleStaff);
            }
        }
    };

    /*工具*/
    var facilities = {
        /*处理空字段 为null 和 undefined 情况*/
        isNullOrEmpty: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /*处理空字段 为null 和 undefined 情况*/
        formatNullField: function (obj, field) {
            if (facilities.isNullOrEmpty(obj)) {
                return "";
            }
            else {
                //讲角色ID 转换为 角色名称
                if (field == "role") {
                    return roleActions.parseIdToName(obj);
                }
                return obj;
            }
        },
        /*生成html flag=0,表示页面模板，flag=1表示tr模板*/
        buildHtml: function (data, flag) {
            var tableData = [];
            $.each(data, function (i, item) {
                var info = {
                    name: facilities.formatNullField(item.name, ""),
                    dept: facilities.formatNullField(item.dep_name, ""),
                    roles: facilities.formatNullField(item.role_ids, "role"),
                    phone: facilities.formatNullField(item.telphone, ""),
                    email: facilities.formatNullField(item.email, ""),
                    uid: facilities.formatNullField(item.uid, "")
                };
                tableData.push(info);
            });
            if (flag == 0) {
                var htmlTpl = require("./tpl/index.html");
                var html = doT.template(htmlTpl)(tableData);
                return html;
            }
            else if (flag == 1) {
                var htmlTpl = require("./tpl/pagerTemp.html");
                var html = doT.template(htmlTpl)(tableData);
                return html;
            }
        }
    };

    /*呈现页面数据*/
    var render = {
        hasRole: function (hasRole) {
            if (!hasRole) {
               // $(".undistributed-user").css("background-color", "lightsteelblue");
               // $(".undistributed-user").css({
               //     "position": "relative",
               //     "border": "#E7E7E7 solid 1px",
               //     "border-bottom": "0px"
               // });
               // $(".assigned-user").css({"top": "0px", "border": "0px"});
               // $(".table-page").css({"border": "#E7E7E7 solid 1px"});
                $(".table-page .beeWebTable").find('th').eq(2).css("display", "none");
                $(".table-page .beeWebTable").find('.role_role').css("display", "none");
            }
        },
        /*渲染表格，翻页，flag=2，表示已认证*/
        toTable: function (name, hasRole, curPageIndex, displayCount, flag) {
            invokeServer.GetUserRoleList(name, hasRole, curPageIndex, displayCount, flag, function (data) {
                //缓存当前页所有用户信息
                cache.PageUser = data.allUsers;
                //根据数据构造html模板
                var trHtml = facilities.buildHtml(data.allUsers, 1);
                $(".userRoleManage").find("tbody").fadeOut(500, function () {
                    $(this).html(trHtml).fadeIn(500);
                    render.hasRole(hasRole);
                });
            }, function (error) {
            });
        },
        /*渲染页面，flag=2，表示已认证*/
        toPage: function (name, hasRole, curPageIndex, displayCount, flag,tab) {
            invokeServer.GetUserRoleList(name, hasRole, curPageIndex, displayCount, flag, function (data) {
                //缓存当前页所有用户信息
                cache.PageUser = data.allUsers;
                //根据数据构造html模板
                var html = facilities.buildHtml(data.allUsers, 0);
                require("./css/userRoleManage.css");

                if(tab==0){
                    var temp=$(html).find(".table-page").html();
                    $(".table-page").html(temp);
                }else{
                    $("#menu_content").html(html);
                    //绑定事件
                    events.add();
                    events.delete();
                    events.detail();
                    events.update();
                    events.bindMenuClass();
                    events.select();
                }

                //获取分页的总页数
                var allCount = parseInt(data.total / 10);
                if (data.total % 10 > 0) {
                    allCount++;
                }
                //require("PagerPath/css/customPager.css");
                require.async("PagerPath/customPager", function () {
                    $(".userRole_pager").customPager({
                        curPage: 1,
                        allCount: allCount,
                        bindData: function (curPageIndex, displayCount, maxCount) {
                            render.toTable(name, hasRole, curPageIndex, displayCount, 2);
                        }
                    })
                });

                render.hasRole(hasRole);
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        }
    };

    var actions = {
        init: function () {
            var name = $(".search-centent #searchUserName").val() == undefined ? "" : $(".search-centent #searchUserName").val();
            if (cache.Roles.length > 0) {
                var borderWidth = $(".undistributed-user").css("borderWidth");
                borderWidth = !!borderWidth ? borderWidth : "";
                if (borderWidth.split("p") > 0) {
                    render.toPage(name, false, 1, 10, 2,1);
                } else {
                    render.toPage(name, true, 1, 10, 2,1);
                }
            } else {
                //第一次加载页面获取所有角色信息
                invokeServer.GetAllRole(function (data) {
                    if (data.status == 0) {
                        //缓存当前所有角色信息
                        cache.Roles = data.info.roles;
                        render.toPage(name, true, 1, 10, 2,1);
                    }
                }, function (error) {
                    //处理加载数据出错
                    $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                });
            }
        }
    };

    module.exports = actions;
});