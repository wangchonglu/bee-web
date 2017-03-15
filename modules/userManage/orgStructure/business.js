/**
 * Created by Moment on 2015/8/11.
 */
define(function (require, exports, module) {
    var orgSettings = require("../foundation/settings");

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    };

    function ajaxRequest(url, type, reqData, callback,errorback) {
        $.support.cors = true;
        //reqData=JSON.stringify(reqData);
        $.ajax({
            type: type,
            url: url,
            //contentType : 'application/json',
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if (data.status==0 && $.isFunction(callback)) {
                    callback(data);
                }
                else if ($.isFunction(errorback)){
                    errorback(data);
                }
            },
            error: function (XMLHttpRequest) {
                if ($.isFunction(callback)) {
                    errorback(XMLHttpRequest);
                }
            }
        });
    };

    var actions = {
        //获取部门
        GetDeptInfo: function (callback,errorback) {
            var url = orgSettings.api.getDeptList;
            //"dE1C1UY/tfDR0Z/RW0UVul4EHB0ziqgNeqevM6WySAKJLbLgozKWhw=="
            var reqData = {
                token:orgSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorback);
        },

        //添加部门
        AddDeptInfo: function (deptCode, deptName, deptType,pid, callback,errorback) {
            var url = orgSettings.api.addDept;
            var reqData = {
                token: orgSettings.loginUser.token,
                tid: orgSettings.loginUser.tid,
                pid: pid,
                code: deptCode,
                name: deptName,
                type: deptType
            };

            ajaxRequest(url, "POST", reqData, callback,errorback);
        },

        //更新部门
        UpdateDeptInfo: function (deptCode, deptId, deptName, pid, callback,errorback) {
            var url = orgSettings.api.updateDept;
            var reqData = {
                token: orgSettings.loginUser.token,
                id: deptId,
                tid: orgSettings.loginUser.tid,
                code: deptCode,
                name: deptName,
                pid:pid
            };

            ajaxRequest(url, "POST", reqData, callback,errorback);
        },

        //删除部门
        DeleteDeptInfo: function (deptId, callback,errorback) {
            var url = orgSettings.api.deleteDept;
            var reqData = {
                token: orgSettings.loginUser.token,
                id: deptId
            };

            ajaxRequest(url, "GET", reqData, callback,errorback);
        },

        //获取部门用户
        getDepartUsers: function (did,page,size,callback,errorback) {
            var url = orgSettings.api.getDepartUsers;
            var reqData = {
                token: orgSettings.loginUser.token,
                did: did,
                page:page,
                size:size
            };

            ajaxRequest(url, "GET", reqData, callback,errorback);
        }

    };
    module.exports = actions;
});