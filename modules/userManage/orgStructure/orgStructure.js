define(function (require, exports, module) {
    var doT = require("doT");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");
    //全局变量，存储所有部门信息，非树形结构
    var deptArrayInfo = [];

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    }

    //事件函数
    var events = {
        addDept: function () {
            $(".orgStructure").on("click", ".addDepartment", function () {
                var validate;

                //0 表示add ,1表示edit
                var jsonObj = { addOrEdit: 0, departmentCode: "", departmentName: "", superName: "" };
                require.async(["./tpl/addDepartment.html", "./css/addDeparment.css"], function ( conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "新增部门",
                        content: html,
                        width: 500,
                        height: 300,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var code = $("input[name=departmentCode]").val();
                            var name = $("input[name=departmentName]").val();
                            var pid = $("input[name=superiorDepartment]").attr("data-val");
                            var type = "1";
                            invokeServer.AddDeptInfo(code, name, type, pid, function (message) {
                                //添加部门成功，重新绑定数据
                                if (message.status == 0) {
                                    actions.init();
                                }
                            });
                            return true;
                        }
                    });
                    //绑定自动完成控件
                    var $superDept = $("#superiorDepartment");
                    require.async("autoCompletePath/autoComplete", function (autoComplete) {
                        var dataA = [];
                        if ($.isArray(deptArrayInfo)) {
                            $.each(deptArrayInfo, function (i, item) {
                                var info = { deptName: item.name, deptId: item.id };
                                dataA.push(info);
                            });
                            $superDept.autoComplete({
                                data: dataA,
                                request: {
                                    url: "www.baidu.com",
                                    type: "get",
                                    data: "上海"
                                },
                                textField: "deptName",
                                valueField: "deptId",
                                callback: function (retval, items, $this) {

                                }
                            });
                        }
                    });

                    //注册需要验证的输入框
                    validate = $(".add_dept_pop input").simpleValidate();
                });
            });
        },
        editDept: function () {
            $(".orgStructure").on("click", ".table-edit", function () {
                var validate;

                var $tr = $(this).parent().parent();
                var deptId = $tr.attr("data-id");
                var parentId = $tr.attr("parent-id");
                var deptCode = $tr.find(".depart-code").html();
                var deptName = $tr.find(".depart-name").html();
                var superName = $tr.find(".super-name").html();
                //0 表示add ,1表示edit
                var jsonObj = { addOrEdit: 1, departmentCode: deptCode, departmentName: deptName, superName: superName };
                require.async(["./tpl/addDepartment.html", "./css/addDeparment.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "编辑部门",
                        content: html,
                        width: 500,
                        height: 300,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }

                            var code = $("input[name=departmentCode]").val();//"dept0002";
                            var id = deptId;
                            var name = $("input[name=departmentName]").val();//"国际金融部";
                            var type = "1";
                            var pid = parentId;
                            var newPid = $("input[name=superiorDepartment]").attr("data-val");
                            if (!isNullOrEmpty(newPid)) {
                                pid = newPid;
                            }
                            invokeServer.UpdateDeptInfo(code, id, name, pid, function (message) {
                                //编辑部门成功，重新绑定数据
                                if (message.status == 0) {
                                    actions.init();
                                }
                            });
                            return true;
                        }
                    });
                    //绑定自动完成控件
                    var $superDept = $("#superiorDepartment");
                    require.async("autoCompletePath/autoComplete", function (autoComplete) {
                        var dataA = [];
                        $.each(deptArrayInfo, function (i, item) {
                            //自己当前部门不加入数据源
                            if (deptId != item.id) {
                                var info = { deptName: item.name, deptId: item.id };
                                dataA.push(info);
                            }
                        });
                        $superDept.autoComplete({
                            data: dataA,
                            request: {
                                url: "www.baidu.com",
                                type: "get",
                                data: "上海"
                            },
                            textField: "deptName",
                            valueField: "deptId",
                            callback: function (retval, items, $this) {

                            }
                        });
                    });

                    //注册需要验证的输入框
                    validate = $(".add_dept_pop input").simpleValidate();
                });
            });
        },
        delDept: function () {
            $(".orgStructure").on("click", ".table-delete", function () {
                if (confirm("确定要删除吗？")) {
                    var deptId = $(this).parent().parent().attr("data-id");
                    invokeServer.DeleteDeptInfo(deptId, function (message) {
                        //编辑部门成功，重新绑定数据
                        if (message.status == 0) {
                            actions.init();
                        }
                    });
                }
            });
        },
        subDept: function () {
            $(".orgStructure").on("click", ".sub_dept", function () {
                var $tr = $(this).parent().parent();
                var trWidth = $tr.width();
                $(".return_dept").show();
                var deptID = $tr.attr("data-id");
                var subdept = deptObj.getSubDept(deptID);

                if ($.isArray(subdept)) {
                    var tempHtml = require("./tpl/rollPage.html");
                    var html = doT.template(tempHtml)(subdept);
                    //html=$(html).find(".org_tables_frames_margin").html();
                    var moveLen = trWidth + "px";
                    var moveLenN = "-" + trWidth + "px";
                    var tbHeight = "-" + $(".org_table_content").height() + "px";

                    $(".org_tables_frames_margin").append(html).find(".org_table_content:eq(1)").css({ "margin-left": moveLen, "position": "relative", "top": tbHeight });
                    $(".org_table_content:eq(0)").animate({ "margin-left": moveLenN }, 500, function () {
                        $(this).remove();
                    });
                    $(".org_table_content:eq(1)").animate({ "margin-left": "0px", display: "block" }, 500, function () {
                        $(this).css("top", "0");
                    });
                }
            });
        },
        returnDept: function () {
            $(".orgStructure").on("click", ".return_dept", function () {
                var $tr = $("tr:eq(1)");
                var deptID = $tr.attr("parent-id");
                var trWidth = $tr.width();
                var item = deptObj.getDept(deptID);
                var subdept = deptObj.getSubDept(item.parentId);
                if (subdept[0].parentName.indexOf("全公司") < 0) {
                    $(".return_dept").show();
                } else {
                    $(".return_dept").hide();
                }
                var tempHtml = require("./tpl/rollPage.html");
                var html = doT.template(tempHtml)(subdept);
                var moveLen = trWidth + "px";
                var moveLenN = "-" + trWidth + "px";
                var tbHeight = "-" + $(".org_table_content").height() + "px";

                $(".org_tables_frames_margin").append(html).find(".org_table_content:eq(1)").css({ "margin-left": moveLenN, "position": "relative", "top": tbHeight });
                $(".org_table_content:eq(0)").animate({ "margin-left": moveLen }, 500, function () {
                    $(this).remove();
                });
                $(".org_table_content:eq(1)").animate({ "margin-left": "0px", display: "block" }, 500, function () {
                    $(this).css("top", "0");
                });
            });
        }
    };

    //部门对象
    var deptObj = {
        getAllDeptInfo: function (data, parentId, parentName, deptArrayInfo) {
            if (!isNullOrEmpty(data.tree)) {
                var subs = false;
                if (data.tree.subs != undefined) {
                    subs = true;
                }
                var info = { id: data.tree.id, name: data.tree.name, code: data.tree.departCode, parentId: undefined, parentName: undefined, child: subs };
                deptArrayInfo.push(info);
                if (!isNullOrEmpty(data.tree.subs) && data.tree.subs.length > 0) {
                    return deptObj.getAllDeptInfo(data.tree.subs, data.tree.id, data.tree.name, deptArrayInfo);
                }
            }
            if (!isNullOrEmpty(data) && data.length > 0) {
                $.each(data, function (i, item) {
                    var subs = false;
                    if (item.subs != undefined) {
                        subs = true;
                    }
                    var info = { id: item.id, name: item.name, code: item.departCode, parentId: parentId, parentName: parentName, child: subs };
                    deptArrayInfo.push(info);
                    if (!isNullOrEmpty(item.subs) && item.subs.length > 0) {
                        return deptObj.getAllDeptInfo(item.subs, item.id, item.name, deptArrayInfo);
                    }
                });
            }
            return deptArrayInfo;
        },
        getSubDept: function (parentid) {
            var datas = deptArrayInfo.filter(function (item) {
                return item.parentId == parentid;
            });
            return datas;
        },
        getDept: function (id) {
            var datas = deptArrayInfo.filter(function (item) {
                return item.id == id;
            });
            return datas[0];
        }
    };

    //绑定数据函数，渲染页面
    var render = {
        toPage: function () {
            invokeServer.GetDeptInfo(function (data) {
                //存储全公司所有部门
                deptArrayInfo = [];
                deptArrayInfo = deptObj.getAllDeptInfo(data, null, null, deptArrayInfo);
                require.async(["./tpl/index.html", "./css/orgStructure.css"], function (htmlTpl, css) {
                    var html = doT.template(htmlTpl)(data.tree);
                    $("#menu_content").html(html);
                    //绑定页面所有事件
                    events.addDept();
                    events.editDept();
                    events.delDept();
                    events.subDept();
                    events.returnDept();
                });
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        }
    };

    var actions = {
        init: function () {
            render.toPage();
        },
        getDeptList: function (callback) {
            if (deptArrayInfo.length > 0) {
                if ($.isFunction(callback)) {
                    callback(deptArrayInfo);
                }
            }
            else {
                invokeServer.GetDeptInfo(function (data) {
                    deptArrayInfo = deptObj.getAllDeptInfo(data, null, null, deptArrayInfo);
                    if ($.isFunction(callback)) {
                        callback(deptArrayInfo);
                    }
                });
            }
        },
        getDepartUsers: function (did, callback) {
            invokeServer.getDepartUsers(did, 1, 10000, function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            });
        }
    };
    module.exports = actions;
});