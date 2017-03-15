/**
 * Created by Moment on 2015/8/11.
 */
define(function (require, exports, module) {
    var foundSettings = require("../foundation/settings");

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    };

    function ajaxRequest(url, type, reqData, callback,errorcall) {
        $.support.cors = true;
        $.ajax({
            type: type,
            url: url,
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if (data.status==0 && $.isFunction(callback)) {
                    callback(data);
                }
                else if ($.isFunction(errorcall)){
                    errorcall(data);
                }
            },
            error: function (XMLHttpRequest) {
                if ($.isFunction(errorcall)) {
                    errorcall(XMLHttpRequest);
                }
            }
        });
    };

    var actions = {
        //获取企业通讯录 page:当前页，length:页大小
        GetInfo: function (page,length,flag,callback,errorcall) {
            var url = foundSettings.api.getEmployeeList;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid:foundSettings.loginUser.tid,
                page:page,
                length:length
            };
            if(!isNullOrEmpty(flag)){
                reqData.flag=flag;
            }
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //添加企业通讯录
        AddInfo: function (name,deptId, phone,email,uid,callback,errorcall) {
            var url = foundSettings.api.addEmployee;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid: foundSettings.loginUser.tid,
                name: name,
                departId: deptId,
                phone: phone,
                email:email,
                uid:uid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //更新企业通讯录
        UpdateInfo: function (user, pid, callback,errorcall) {
            var url = foundSettings.api.updateEmployee;
            var reqData = {
                token: foundSettings.loginUser.token,
                id: user.phoneId,
                tid: foundSettings.loginUser.tid,
                code: user.deptCode,
                name: user.name,
                pid:pid
            };

            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        //驳回认证申请
        DenyApply: function (phoneId,uid, callback,errorcall) {
            var url = foundSettings.api.denyEmployee;
            var reqData = {
                token: foundSettings.loginUser.token,
                phone: phoneId,
                uid:uid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //发送短信
        SendMessage: function (userId, callback,errorcall) {
            var url = foundSettings.api.sendMessage;
            var reqData = {
                token: foundSettings.loginUser.token,
                userIds: userId
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        }

    };
    module.exports = actions;
});