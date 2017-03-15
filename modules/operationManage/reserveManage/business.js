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
        //获取预约列表 page:当前页，size:页大小
        getOrderList: function (page,size,sortorder,sortdatafield,userName,productName,callback,errorcall) {
            var url = foundSettings.api.getOrderList;
            var reqData = {
                token: foundSettings.loginUser.token,
                page:page,
                size:size,
                sortorder:sortorder,
                sortdatafield:sortdatafield
            };
            if(!isNullOrEmpty(userName)){
                reqData.userName=userName;
            }
            if(!isNullOrEmpty(productName)){
                reqData.productName=productName;
            }
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        },
        //我的预约列表 page:当前页，size:页大小
        getMyOrder: function (page,size,callback,errorcall) {
            var url = foundSettings.api.getMyOrder;
            var reqData = {
                token: foundSettings.loginUser.token,
                page:page,
                size:size
            };
            ajaxRequest(url, "POST", reqData, callback,errorcall);
        }
    };
    module.exports = actions;
});