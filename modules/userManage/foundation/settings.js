/**
 * Created by Moemnt on 2015/8/11.
 */
define(function (require, exports, module) {
    //获取全局配置文件
    var globalSetting = require("globalSetting");

    //默认配置
    var userApi = {
        /*-----------------------组织架构定义接口--------------------------------*/
        //获取部门信息接口
        getDeptList: globalSetting.api.baseServer + "depart/get-tree",
        //新增部门接口
        addDept: globalSetting.api.baseServer + "depart/create-depart",
        //更新部门接口
        updateDept: globalSetting.api.baseServer + "depart/update-depart",
        //删除部门接口
        deleteDept: globalSetting.api.baseServer + "depart/delete-depart",
        //获取部门用户
        getDepartUsers: globalSetting.api.baseServer + "depart/get-users",

        /*-----------------------企业通讯录管理接口--------------------------------*/
        //获取未认证员工列表信息接口：(分页)
        getApplyUser: globalSetting.api.baseServer + "user/get-apply-user",
        //新增员工信息接口
        addEmployee: globalSetting.api.baseServer + "user/create-user",
        //驳回员工申请认证接口(修改某个标志量，软删除)
        denyEmployee: globalSetting.api.baseServer + "user/deny-join-tenant",
        //发送短信接口
        sendMessage:globalSetting.api.baseServer + "user/send-message",
        //获取用户详情
        getUserDetail:globalSetting.api.baseServer + "user/get-user-detail",
        //根据名称模糊查询用户
        searchUserByName:globalSetting.api.baseServer + "user/search-users",
        //移动用户
        moveUser:globalSetting.api.baseServer + "user/update-users-depart",

        /*-----------------------用户角色管理接口--------------------------------*/
        //获取所有员工的角色列表信息(分页)
        getAllRole: globalSetting.api.baseServer + "role/all-role",
        //根据uid获取用户角色
        getUserRole:globalSetting.api.baseServer + "role/user-role",
        //修改用户角色
        updateUserRole:globalSetting.api.baseServer + "role/update-role",
        //获取所有员工的角色列表信息(分页)
        getUserRoleList:globalSetting.api.baseServer + "role/search-role-users",
        //根据角色id获取用户
        searchUser:globalSetting.api.baseServer + "role/get-users",

        /*-----------------------调岗离职管理接口--------------------------------*/


        /*-----------------------团队管理--------------------------------*/
        //线索池创建组
        createGroup: globalSetting.api.baseServer + "lead/create-group",
        //线索池设置组管理员
        setGroupAdmin: globalSetting.api.baseServer + "lead/set-group-admin",
        //线索池设置成员
        assignGroupMember: globalSetting.api.baseServer + "lead/set-group-member",
        //获取组下的成员信息
        getMemberList:globalSetting.api.baseServer + "lead/get-member-list",
        //获取组下的管理员信息
        getAdminList:globalSetting.api.baseServer + "lead/get-admin-list",
        //获取公海池分组列表：即每个团队的概要信息
        getTeamList:globalSetting.api.baseServer + "lead/get-highsea-list",
        //获取每个团队人员的详细信息
        getTeamMemberInfo:globalSetting.api.baseServer + "lead/get-member-leads-num"
    };
    //merger request url
    var newApi = $.extend(userApi, globalSetting.api);
    globalSetting.api = newApi;

    //exports new config
    module.exports = globalSetting;

});