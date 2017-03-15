/**
 * Created by Moment on 2015/9/5.
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
        //待我审批的报单列表 page:当前页，size:页大小
        getApprovalList: function (page,size,callback,errorcall) {
            var url = foundSettings.api.getApprovalList;
            var reqData = {
                token: foundSettings.loginUser.token,
                page:page,
                size:size
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        //获取单个报单详情
        getReportInfo: function (id,callback,errorcall) {
            var url = foundSettings.api.getReportInfo;
            var reqData = {
                token: foundSettings.loginUser.token,
                id: id
            };
            ajaxRequest(url, "GET", reqData, callback,errorcall);
        },
        //报单审核
        reportVerify: function (id,status,opinion,payAmount, callback,errorcall) {
            var url = foundSettings.api.reportVerify;
            var reqData = {
                token: foundSettings.loginUser.token,
                id: id,
                status:status,
                opinion:opinion
            };
            if(payAmount!=undefined){
                reqData.pay_amount=payAmount;
            }
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },

        //报单审批日志
        getApprovalLog: function (id, callback,errorcall) {
            var url = foundSettings.api.getApprovalLog;
            var reqData = {
                token: foundSettings.loginUser.token,
                id: id
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        }

    };
    module.exports = actions;
});