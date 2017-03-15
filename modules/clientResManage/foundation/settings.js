/**
 * Created by Moemnt on 2015/8/11.
 */
define(function (require, exports, module) {
    //获取全局配置文件
    var globalSetting = require("globalSetting");

    //默认配置
    var userApi = {
        //获取线索池中的线索()
        getLeadsPoolList: globalSetting.api.baseServer + "lead/get-sea-leads",


        /*-----------------------线索池--------------------------------*/
        //线索池创建组
        createGroup: globalSetting.api.baseServer + "lead/create-group",
        //线索池设置组管理员
        setGroupAdmin: globalSetting.api.baseServer + "lead/set-group-admin",
        //线索池设置成员
        assignGroupMember: globalSetting.api.baseServer + "lead/set-group-member",
        //获取线索池组的列表
        getGroupList: globalSetting.api.baseServer + "lead/get-group-list",
        //获取线索池所有线索的id
        getSeaLeadIds: globalSetting.api.baseServer + "lead/get-sea-leadIds",
        //导入线索
        importLead: globalSetting.api.baseServer + "lead/import",

        //分配线索给用户
        assignLeadsToUser: globalSetting.api.baseServer + "lead/assign-leads-user",
        //分配线索给组
        assignLeadsToGroup: globalSetting.api.baseServer + "lead/assign-leads-group",
        //获取组下的成员信息
        getMemberList:globalSetting.api.baseServer + "lead/get-member-list",
        //获取组下的管理员信息
        getAdminList:globalSetting.api.baseServer + "lead/get-admin-list",

        /*------------------------------------------新接口--------------------------------------------------*/
        //获取公海池所有的团队
        getSeaDetail:globalSetting.api.baseServer + "lead/get-highsea-list",
        //获取每个团队人员的详细信息
        getTeamMemberInfo:globalSetting.api.baseServer + "lead/get-member-leads-num",
        //获取每个用户的线索信息
        getUserLeads:globalSetting.api.baseServer + "lead/get-user-lead-by-id",
        //新增线索批次
        createBatch:globalSetting.api.baseServer + "lead/batch-create",
        //我的线索批次列表
        batchList:globalSetting.api.baseServer + "lead/batch-list",
        //获取垃圾线索列表
        getGarbageLead:globalSetting.api.baseServer + "lead/get-error-lead-list"

    };
    //merger request url
    var newApi = $.extend(userApi, globalSetting.api);
    globalSetting.api = newApi;

    //exports new config
    module.exports = globalSetting;

});