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
        //获取未认证员工列表信息接口 page:当前页，length:页大小
        GetApplyUser: function (page,length,callback,errorcall) {
            var url = foundSettings.api.getApplyUser;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid:foundSettings.loginUser.tid,
                page:page,
                length:length
            };
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
        },

        //根据uid获取用户详情
        getUserDetail: function (uid, callback,errorcall) {
            var url = foundSettings.api.getUserDetail;
            var reqData = {
                token: foundSettings.loginUser.token,
                uid: uid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //根据姓名搜索用户
        searchUser:function(name,page,length,callback,errorcall){
            var url = foundSettings.api.searchUserByName;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid: foundSettings.loginUser.tid,
                name:name,
                page:page,
                length:length
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //移动用户
        moveUser:function(userIds,departId,departName,callback,errorcall){
            var url = foundSettings.api.moveUser;
            var reqData = {
                token: foundSettings.loginUser.token,
                userIds: userIds,
                departId:departId,
                departName:departName
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        /*---------------------------------------Dept Actions------------------------------------------------*/

        //获取部门
        GetDeptInfo: function (callback,errorback) {
            var url = foundSettings.api.getDeptList;
            var reqData = {
                token:foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorback);
        },

        //添加部门
        AddDeptInfo: function (deptName, deptType,pid, callback,errorback) {
            var url = foundSettings.api.addDept;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid: foundSettings.loginUser.tid,
                pid: pid,
                name: deptName,
                type: deptType
            };

            ajaxRequest(url, "POST", reqData, callback,errorback);
        },

        //更新部门
        UpdateDeptInfo: function (deptId, deptName, pid, callback,errorback) {
            var url = foundSettings.api.updateDept;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid: foundSettings.loginUser.tid,
                id: deptId,
                name: deptName,
                pid:pid
            };

            ajaxRequest(url, "POST", reqData, callback,errorback);
        },

        //删除部门
        DeleteDeptInfo: function (deptId, callback,errorback) {
            var url = foundSettings.api.deleteDept;
            var reqData = {
                token: foundSettings.loginUser.token,
                id: deptId
            };

            ajaxRequest(url, "GET", reqData, callback,errorback);
        },

        //获取部门用户
        getDepartUsers: function (did,page,size,callback,errorback) {
            var url = foundSettings.api.getDepartUsers;
            var reqData = {
                token: foundSettings.loginUser.token,
                did: did,
                page:page,
                size:size
            };

            ajaxRequest(url, "GET", reqData, callback,errorback);
        },

        /*---------------------------------------Leads Actions------------------------------------------------*/
        //获取公海池分组列表：即每个团队的概要信息
        getTeamList: function (callback,errorcall) {
            var url = foundSettings.api.getTeamList;
            var reqData = {
                token: foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //获取线索池管理员
        getAdminList: function (highSeaId,callback,errorcall) {
            var url = foundSettings.api.getAdminList;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId: highSeaId
            };
            SyncAjaxRequest(url, "GET", reqData, callback,errorcall);
        },
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
            uids=uids+","+foundSettings.loginUser.uid;
            var reqData = {
                token: foundSettings.loginUser.token,
                uids: uids,
                gid:gid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        }

    };
    module.exports = actions;
});