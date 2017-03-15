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
    }

    function ajaxRequest(url, type, reqData, callback, errorcall) {
        $.support.cors = true;
        $.ajax({
            type: type,
            url: url,
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if (data.status == 0 && $.isFunction(callback)) {
                    callback(data);
                }
                else if ($.isFunction(errorcall)) {
                    errorcall(data);
                }
            },
            error: function (XMLHttpRequest) {
                if ($.isFunction(errorcall)) {
                    errorcall(XMLHttpRequest);
                }
            }
        });
    }

    function SyncAjaxRequest(url, type, reqData, callback, errorcall) {
        $.support.cors = true;
        $.ajax({
            async: false,
            type: type,
            url: url,
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if (data.status == 0 && $.isFunction(callback)) {
                    callback(data);
                }
                else if ($.isFunction(errorcall)) {
                    errorcall(data);
                }
            },
            error: function (XMLHttpRequest) {
                if ($.isFunction(errorcall)) {
                    errorcall(XMLHttpRequest);
                }
            }
        });
    }

    var actions = {
        //获取所有角色
        GetAllRole: function (callback, errorcall) {
            var url = foundSettings.api.getAllRole;
            var reqData = {
                token: foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback, errorcall);
        },
        //根据uid获取用户角色
        GetUserRole: function (uid, callback, errorcall) {
            var url = foundSettings.api.getUserRole;
            var reqData = {
                token: foundSettings.loginUser.token,
                uid: uid
            };
            ajaxRequest(url, "GET", reqData, callback, errorcall);
        },

        //更新用户角色
        UpdateUserRole: function (uid, rid, callback, errorcall) {
            var url = foundSettings.api.updateUserRole;
            var reqData = {
                token: foundSettings.loginUser.token,
                uid: uid,
                rid: rid
            };
            ajaxRequest(url, "GET", reqData, callback, errorcall);
        },
        GetUserRoleList: function (name, hasRole, page, length, flag, callback, errorcall) {
            var url = foundSettings.api.getUserRoleList;
            var reqData = {
                name: name,
                hasRole: hasRole,
                token: foundSettings.loginUser.token,
                tid: foundSettings.loginUser.tid,
                page: page,
                length: length,
            };
            //if (!isNullOrEmpty(flag)) {
            //    reqData.flag = flag;
            //}
            ajaxRequest(url, "GET", reqData, callback, errorcall);
        },
        SearchUser: function (rid, callback, errorcall) {
            var url = foundSettings.api.searchUser;
            var reqData = {
                token: foundSettings.loginUser.token,
                rid: rid
            };
            ajaxRequest(url, "GET", reqData, callback, errorcall);
        }

    };
    module.exports = actions;
});