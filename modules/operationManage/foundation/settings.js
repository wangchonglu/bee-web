/**
 * Created by Moemnt on 2015/8/11.
 */
define(function (require, exports, module) {
    //获取全局配置文件
    var globalSetting = require("globalSetting");

    //默认配置
    var userApi = {
        /*-----------------------合同签发--------------------------------*/
        //获取合同列表
        getApplyList: globalSetting.api.baseServer + "lead/create-group",


        /*-----------------------报单管理--------------------------------*/
        getApprovalList:globalSetting.api.baseServer + "report/approval-list",
        getReportInfo:globalSetting.api.baseServer + "report/report_info",
        getApprovalLog:globalSetting.api.baseServer + "report/approval_log",
        reportVerify:globalSetting.api.baseServer + "report/verify",

        /*-----------------------预约管理--------------------------------*/
        getOrderList:globalSetting.api.baseServer + "product/all-product-order",
        getMyOrder:globalSetting.api.baseServer + "product/my-create-product-order"

    };
    //merger request url
    var newApi = $.extend(userApi, globalSetting.api);
    globalSetting.api = newApi;

    //exports new config
    module.exports = globalSetting;

});