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
        //获取线索池组的列表(默认数组里第一个是公海池的组，返回数据:数组[id,name])
        getGroupList: function (callback,errorcall) {
            var url = foundSettings.api.getGroupList;
            var reqData = {
                token: foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //获取线索池中的线索  sid:公海池id，allstatus：1表示全部，其他表示未分配,返回数据:数组[线索id]
        getSeaLeadIds: function (sid,allStatus,callback,errorcall) {
            var url = foundSettings.api.getSeaLeadIds;
            var reqData = {
                token: foundSettings.loginUser.token,
                sid:sid,
                allStatus:allStatus
            };
            //ajaxSyncRequest
            ajaxRequest(url, "GET", reqData, callback,errorcall);

        },

        //分配线索给组
        assignLeadsToGroup: function (groupId, leadIds, callback,errorcall) {
            var url = foundSettings.api.assignLeadsToGroup;
            var reqData = {
                token: foundSettings.loginUser.token,
                groupId: groupId,
                leadIds: leadIds
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        //分配线索给用户
        assignLeadsToUser: function (userId,leadIds, callback,errorcall) {
            var url = foundSettings.api.assignLeadsToUser;
            var reqData = {
                token: foundSettings.loginUser.token,
                userId: userId,
                leadIds: leadIds
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
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

        //导入线索
        importLead: function (highSeaId, leads,callback,errorcall) {
            leads=JSON.stringify(leads);
            leads=JSON.stringify(leads);
            var url = foundSettings.api.importLead;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId: highSeaId,
                leads:leads
            };
            //reqData=JSON.stringify(reqData);
            $.support.cors = true;
            $.ajax({
                type: "POST",
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

            //ajaxRequest(url, "POST", reqData, callback,errorcall);
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


        /*------------------------------------------新接口--------------------------------------------------*/

        checkRole:function(){
            var roles=foundSettings.loginUser.roles.filter(function(item){
                return item.name.indexOf("管理员")>=0;
            });
            if(roles.length>0){
                return true;
            }
            return false;
        },

        //获取公海池所有的团队
        getSeaDetail: function (callback,errorcall) {
            var url = foundSettings.api.getSeaDetail;
            var reqData = {
                token: foundSettings.loginUser.token
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //获取每个团队人员的详细信息,highSeaId:团队id
        getTeamMemberInfo: function (highSeaId,callback,errorcall) {
            var url = foundSettings.api.getTeamMemberInfo;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId:highSeaId
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //获取每个用户的线索信息,highSeaId:团队id
        getUserLeads: function (uid,page,size,callback,errorcall) {
            var url = foundSettings.api.getUserLeads;
            var reqData = {
                token: foundSettings.loginUser.token,
                uid:uid,
                page:page,
                size:size
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        //获取线索池中的线索  sid：公海池id（团队ID）,page:当前页，length:页大小,allStatus:0未分配，1全部
        getLeadsPoolList: function (sid,page,size,allStatus,callback,errorcall) {
            var url = foundSettings.api.getLeadsPoolList;
            var reqData = {
                token: foundSettings.loginUser.token,
                sid:sid,
                page:page,
                size:size,
                allStatus:allStatus
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //我的线索批次列表
        getGarbageLead: function (highSeaId,page,size,callback,errorcall) {
            var url = foundSettings.api.getGarbageLead;
            var reqData = {
                token: foundSettings.loginUser.token,
                highSeaId:highSeaId,
                page:page,
                size:size
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //获取垃圾线索列表
        batchList: function (callback,errorcall) {
            var url = foundSettings.api.batchList;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid:foundSettings.loginUser.tid,
                uid:foundSettings.loginUser.uid
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },

        //新增线索批次
        createBatch: function (name,source,comment,callback,errorcall) {
            var url = foundSettings.api.createBatch;
            var reqData = {
                token: foundSettings.loginUser.token,
                tid:foundSettings.loginUser.tid,
                uid:foundSettings.loginUser.uid,
                name:name,
                source:source,
                comment:comment
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        }

    };
    module.exports = actions;
});