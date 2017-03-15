/**
 * Created by Moment on 2015/8/11.
 */
define(function (require, exports, module) {
    var baseURL = "http://120.26.209.49/";
    var config = {
        //接口api地址
        api: {
            //服务器地址
            baseServer: baseURL,
            //用户登录接口
            login: baseURL + "reg/login"
        },

        //工作空间  平台、本公司==》"platform", "company"
        workSpaces:{
            platform:{name:"platform",displayName:"云平台"},
            company:{ name:"company",displayName:"本公司"     }
        },

        //当前登录用户信息
        loginUser: undefined,

        //所有权限描述
        allRoles: [
            {role: "lesseeAdmin", roleName: "租户管理员", displayName: "管理员"},
            {role: "productManager", roleName: "产品经理", displayName: "产品经理"},
            {role: "channelManager", roleName: "渠道经理", displayName: "渠道经理"},
            {role: "operationManager", roleName: "审核经理", displayName: "运营经理"},
            {role: "settleManager", roleName: "结算经理", displayName: "结算经理"},
            {role: "financialPlanner", roleName: "理财师", displayName: "理财师"},
            {role: "teamCaptain", roleName: "团队长", displayName: "团队长"}
        ],

        //获取当前登录用户的权限集合   roleName为undefined,默认当前用户权限
        getCurrentRole: function () {
            var roles = this.loginUser.roles;
            var retval = [];
            if(roles!=undefined) {
                $.each(this.allRoles, function (i, role) {
                    var filters = $.grep(roles, function (item) {
                        return item.name == role.roleName;
                    });
                    if (filters != undefined && filters.length > 0) {
                        retval.push(role);
                    }
                });
            }
            return retval;
        }
    };
    module.exports = config;
});