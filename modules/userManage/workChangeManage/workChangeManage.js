/**
 * Created by Moment on 2015/08/05.
 */
define(function (require, exports, module) {
    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");
    /*
     判断是否为空
     */
    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    };

    $("#menu_content").on("click", ".work_change .work_change_submit", function () {
        //提交验证
        if (!validate.formValidate()) {
            return false;
        }

        //获取离职人的员工号
        var curUserNum = $("#work_change_user").attr("data-val");
        //获取交接人的员工号
        var curHandOverNum = $("#work_change_handover").attr("data-val");

        var val = $('input:radio[name="work_change_radioGroup"]:checked').val();
        var type = val == 0 ? "调岗" : "离职";


        if (confirm("确定要" + type + "吗？")) {
            //这里做认证操作
            if (val == 0) {
                //这里做调岗操作
                //curUserNum  curHandOverNum
            }
            else if (val == 1) {
                //这里做离职操作
                //curUserNum  curHandOverNum
            }
        }
    });


    var loadPage = function () {
        var userSettings = require("../foundation/settings");
        require.async(["doT", "./tpl/index.html"], function (doT, htmlTpl) {
            require("./css/workChangeManage.css");
            $("#menu_content").html(htmlTpl).fadeIn(500);
            //注册需要验证的输入框
            validate = $(".work_change input").simpleValidate();

            var dataA = [
                {name: "张三", employeeId: "13812345432"},
                {name: "张五", employeeId: "13812345433"},
                {name: "张六", employeeId: "13812345434"},
                {name: "张七", employeeId: "13812345435"},
                {name: "张八", employeeId: "13812345436"},
                {name: "张九", employeeId: "13812345437"}
            ];
            var dataB = [
                {name: "张三", employeeId: "13812345432"},
                {name: "张五", employeeId: "13812345433"},
                {name: "张六", employeeId: "13812345434"},
                {name: "张七", employeeId: "13812345435"},
                {name: "张八", employeeId: "13812345436"},
                {name: "张九", employeeId: "13812345437"}
            ];
            ;
            require.async("autoCompletePath/autoComplete", function (autoComplete) {
                $("#work_change_user").autoComplete({
                    data: dataA,
                    textField: "name",
                    valueField: "employeeId",
                    callback: function (retval, items, $this, thisSettings) {
                        if ($this.attr("id") == "work_change_user") {
                            thisSettings.data = dataB;

                            var aseetInfo = '<ul><li>线索：112</li><li>客户：1212</li><li>机构渠道：192</li></ul>';
                            var handOverInfo = '<ul><li>A产品：项目经理</li><li>B产品：项目经理</li><li>B产品：项目经理</li></ul>';
                            $(".work_change_flow").html(handOverInfo);
                            $(".work_change_asset").html(aseetInfo);

                            //var item = $.grep(dataA, function (item, index) {
                            //    return item.name == retval.title;
                            //});
                            //dataB.push(item);
                            dataB = dataB.filter(function (item) {
                                return item.name != retval.title;
                            });
                        }
                        var changeUser = $("#work_change_user").val();
                        var workChange = $("#work_change_handover").val();
                        var assetChange = $("#asset_change_handover").val();
                        if (workChange == changeUser || assetChange == changeUser) {
                            $("#work_change_handover,#asset_change_handover").val("");
                        }
                    }
                });
                $("#work_change_handover,#asset_change_handover").autoComplete({
                    data: dataB,
                    textField: "name",
                    valueField: "employeeId",
                    callback: function (retval, items, $this, thisSettings) {
                        var changeUser = $("#work_change_user").val();
                        var workChange = $("#work_change_handover").val();
                        var assetChange = $("#asset_change_handover").val();
                        if (workChange == changeUser || assetChange == changeUser) {
                            $("#work_change_handover,#asset_change_handover").val("");
                        }
                    }
                });
            });
        });
    }

    //初始化，加载数据 这里需要调用接口
    var init = function () {
        loadPage();
    };
    exports.init = init;
});
