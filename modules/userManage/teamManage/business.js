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

    function ajaxSyncRequest(url, type, reqData, callback,errorcall) {
        $.support.cors = true;
        $.ajax({
            async:false,
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
        //线索池创建组
        createGroup: function (name, callback,errorcall) {
            var url = foundSettings.api.createGroup;
            var reqData = {
                token: foundSettings.loginUser.token,
                name: name
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //线索池设置组管理员
        setGroupAdmin: function (uids, gid,callback,errorcall) {
            var url = foundSettings.api.setGroupAdmin;
            uids=foundSettings.loginUser.uid;
            var reqData = {
                token: foundSettings.loginUser.token,
                uids: uids,
                gid:gid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //线索池设置成员
        assignGroupMember: function (uids, gid,callback,errorcall) {
            var url = foundSettings.api.assignGroupMember;
            var reqData = {
                token: foundSettings.loginUser.token,
                uids: uids,
                gid:gid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //线索池设置成员
        getMemberList: function (highSeaId,callback,errorcall) {
            var url = foundSettings.api.getMemberList;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId: highSeaId
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //线索池设置成员
        getAdminList: function (highSeaId,callback,errorcall) {
            var url = foundSettings.api.getAdminList;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId: highSeaId
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //线索公海池分组统计
        getSeaDetail: function (callback,errorcall) {
            var url = foundSettings.api.getSeaDetail;
            var reqData = {
                token: foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //获取每个团队人员的详细信息
        getTeamMemberInfo: function (highSeaId,callback,errorcall) {
            var url = foundSettings.api.getTeamMemberInfo;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId:highSeaId
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        }
    };
    module.exports = actions;
});