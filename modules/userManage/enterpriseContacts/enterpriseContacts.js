/**
 * Created by Moment on 2015/08/05..
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");
    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    /*缓存*/
    var cache = {
        /*当前页用户信息*/
        PageUser: [],
        /*认证筛选数据  dataFlag默认undefined则显示全部数据，authContent：记住当前认证状态*/
        authContent: "全部",
        dataFlag: undefined
    };

    /*页面事件*/
    var events = {
        common: function () {
            /*添加操作  需要在内部加载orgStructure.js  获取部门信息*/
            $(".enter_contact").on("click", ".op_add_staff", function () {
                var validate;

                //0 表示 add ,1表示 详情
                var jsonObj = { addOrEdit: 0 };
                require.async(["./tpl/popContent.html", "./css/popContent.css"], function ( conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "新增员工",
                        content: html,
                        width: 450,
                        height: 300,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }

                            var name = $(".popup_content .add_name").val();
                            //var dept=$(".popup_content .add_dept").val();
                            var deptId = $(".popup_content .add_dept").attr("data-val");
                            var phone = $(".popup_content .add_phone").val();
                            var email = $(".popup_content .add_email").val();
                            invokeServer.AddInfo(name, deptId, phone, email,undefined, function (data) {
                                render.toPage(1, 10, cache.dataFlag);
                                //创建成功发送短信密码
                                invokeServer.SendMessage(data.uid);
                            }, function (error) {
                                return false;
                            });
                        }
                    });

                    //绑定自动完成控件
                    var $superDept = $("#enter_contact_dept");
                    require.async(["autoCompletePath/autoComplete", "orgStructure"], function (autoComplete, orgStructure) {
                        //加载orgStructure.js  获取部门信息,绑定自动完成数据源
                        //orgStructure.test();
                        orgStructure.getDeptList(function (deptArrayInfo) {
                            if ($.isArray(deptArrayInfo)) {
                                var dataA = [];
                                $.each(deptArrayInfo, function (i, item) {
                                    var info = { deptName: item.name, deptId: item.id };
                                    dataA.push(info);
                                });
                                $superDept.autoComplete({
                                    data: dataA,
                                    request: {
                                        url: "",
                                        type: "",
                                        data: ""
                                    },
                                    textField: "deptName",
                                    valueField: "deptId",
                                    callback: function (retval, items, $this) {

                                    }
                                });
                            }
                        });
                    });

                    //注册需要验证的输入框
                    validate = $(".popup_content input").simpleValidate();
                });
            });

            /*鼠标经过事件*/
            $(".enter_contact").on({
                mouseover: function () {
                    $(this).removeClass("trEvenBackColor");
                    $(this).removeClass("trOddBackColor");
                    $(this).addClass("trMouseover");
                },
                mouseout: function () {
                    $(this).removeClass("trMouseover");
                    $(".enter_con_table tr:even").addClass("trEvenBackColor");
                    $(".enter_con_table tr:odd").addClass("trOddBackColor");
                }
            }, ".enter_con_table tbody>tr");

            /*筛选数据操作*/
            $(".enter_contact").on("change", ".operation_filter_auth", function () {
                if ($(".operation_filter_auth").val() == "已认证") {
                    cache.dataFlag = 2;
                    cache.authContent = "已认证";
                }
                else if ($(".operation_filter_auth").val() == "待认证") {
                    cache.dataFlag = 1;
                    cache.authContent = "待认证";
                }
                else {
                    cache.dataFlag = undefined;
                    cache.authContent = "全部";
                }
                render.toPage(1, 10, cache.dataFlag);
            });
        },
        auth: function () {
            /*认证操作*/
            $(".enter_contact").on("click", ".list_img_edit", function () {
                //这里做认证操作
                var $tr = $(this).parent().parent();
                var validate;
                require.async(["./tpl/auth.html", "./css/auth.css"], function ( conTem, conCss) {
                    var html = doT.template(conTem)();
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "认证员工",
                        content: html,
                        width: 450,
                        height: 250,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var uid=$tr.attr("data-uid");
                            var name = $tr.find("td[data-field='name']").text();
                            var phone = $tr.find("td[data-field='phone']").text();
                            var email = $tr.find("td[data-field='email']").text();
                            var deptId=$(".auth_dept").attr("data-val");
                            invokeServer.AddInfo(name, deptId, phone, email,uid, function (data) {
                                render.toPage(1, 10, cache.dataFlag);
                                //创建成功发送短信密码
                                invokeServer.SendMessage(data.uid);
                            }, function (error) {
                                alert("服务器出错了！/(ㄒoㄒ)/~~");
                            });
                        }
                    });

                    //绑定自动完成控件
                    var $authDept = $(".auth_dept");
                    require.async(["autoCompletePath/autoComplete", "orgStructure"], function (autoComplete, orgStructure) {
                        orgStructure.getDeptList(function (deptArrayInfo) {
                            if ($.isArray(deptArrayInfo)) {
                                var dataA = [];
                                $.each(deptArrayInfo, function (i, item) {
                                    var info = { deptName: item.name, deptId: item.id };
                                    dataA.push(info);
                                });
                                $authDept.autoComplete({
                                    data: dataA,
                                    request: {
                                        url: "",
                                        type: "",
                                        data: ""
                                    },
                                    textField: "deptName",
                                    valueField: "deptId",
                                    callback: function (retval, items, $this) {

                                    }
                                });
                            }
                        });
                    });

                    //注册需要验证的输入框
                    validate = $(".auth_pop input").simpleValidate();
                });
            });
        },
        refuse: function () {
            /*驳回操作*/
            $(".enter_contact").on("click", ".list_img_delete", function () {
                if (confirm("确定要驳回吗？")) {
                    //这里做驳回操作 软删除当前人
                    var $tr = $(this).parent().parent();
                    var uid = $tr.attr("data-uid");
                    var phone = $tr.find("td[data-field='phone']").text();
                    invokeServer.DenyApply(phone, uid, function (data) {
                        if (data.status == 0) {
                            render.toPage(1, 10, cache.dataFlag);
                        }
                    });
                }
            });
        },
        detail: function () {
            /*详情操作*/
            $(".enter_contact").on("click", ".peo_detail_info", function () {
                var $curTr = $(this).parent().parent();
                var curUid = $curTr.attr("data-uid");
                var curUser = cache.PageUser.filter(function (item) {
                    return item.uid == curUid;
                });
                var curName = facilities.formatNullField(curUser[0].name);
                var curPhone = facilities.formatNullField(curUser[0].telphone);
                var curEmail = facilities.formatNullField(curUser[0].email);
                var curImage = facilities.formatNullField(curUser[0].head_img);
                var curAuth = curUser[0].flag == 2 ? "是" : "否";
                var curPerform = facilities.formatNullField(curUser[0].performance);
                var curSalary = facilities.formatNullField(curUser[0].commission);
                var curScore = facilities.formatNullField(curUser[0].score);
                var curAddr = "上海市浦东新区陆家嘴";
                var curIdCardImg = facilities.formatNullField(curUser[0].id_card_img);
                //0 表示 add ,1表示 详情
                var jsonObj = { addOrEdit: 1, name: curName, phone: curPhone, email: curEmail, image: curImage, auth: curAuth, perform: curPerform, salary: curSalary, score: curScore, addr: curAddr, idcardimg: curIdCardImg };
                require.async(["./tpl/popContent.html", "./css/popContent.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "员工详情信息",
                        content: html,
                        width: 650,
                        height: 550,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            return true;
                        }
                    });
                });
            });
        }
    };

    /*工具*/
    var facilities = {
        isNullOrEmpty: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /*处理空字段 为null 和 undefined 情况*/
        formatNullField: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return "";
            }
            else {
                return obj;
            }
        },
        /*生成html flag=0,表示页面模板，flag=1表示tr模板*/
        buildHtml: function (data, flag) {
            var tableData = [];
            $.each(data, function (i, item) {
                var info = {
                    name: facilities.formatNullField(item.name),
                    dep_name: facilities.formatNullField(item.dep_name),
                    dep_id: facilities.formatNullField(item.dep_id),
                    telphone: facilities.formatNullField(item.telphone),
                    email: facilities.formatNullField(item.email),
                    flag: item.flag,
                    uid: facilities.formatNullField(item.uid)
                };
                tableData.push(info);
            });

            require("./css/enterpriseContacts.css");
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

    var render = {
        /*渲染页面*/
        toPage: function (curPageIndex, displayCount, flag) {
            invokeServer.GetInfo(curPageIndex, displayCount, flag, function (data) {
                if ($.isArray(data.allUsers)) {
                    cache.PageUser = data.allUsers;
                    var html = facilities.buildHtml(data.allUsers, 0);
                    $("#menu_content").html(html);
                    //绑定事件
                    events.common();
                    events.auth();
                    events.detail();
                    events.refuse();

                    //绑定数据筛选项
                    $(".operation_filter_auth").val(cache.authContent);
                    //获取分页的总页数
                    var allCount = parseInt(data.total / 10);
                    if (data.total % 10 > 0) {
                        allCount++;
                    }

                    require("PagerPath/customPager");
                    $(".enter_con_pager").customPager({
                        curPage: 1,
                        allCount: allCount,
                        bindData: function (curPageIndex, displayCount, maxCount) {
                            render.toTable(curPageIndex, displayCount, cache.dataFlag);
                        }
                    });

                }
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        },
        /*渲染表格*/
        toTable: function (curPageIndex, displayCount, flag) {
            invokeServer.GetInfo(curPageIndex, displayCount, flag, function (data) {
                if ($.isArray(data.allUsers)) {
                    //存储当前页的用户信息
                    cache.PageUser = data.allUsers;
                    var trHtml = facilities.buildHtml(data.allUsers, 1);
                    $(".enter_con_table").find("tbody").fadeOut(500, function () {
                        $(this).html(trHtml).fadeIn(500);
                    });
                }
            });
        }
    };

    var actions = {
        init: function () {
            //记住当前认证状态
            cache.authContent = "全部";
            render.toPage(1, 10, undefined);
        },
        getContactsInfo: function (callback, errorcall) {
            invokeServer.GetInfo(1, 1000000, 2, function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            }, function (error) {
                if ($.isFunction(errorcall)) {
                    errorcall(error);
                }
            });
        }
    };

    module.exports = actions;
});
