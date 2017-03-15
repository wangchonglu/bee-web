/**
 * Created by chonglu.wang on 2015/8/24.
 */
define(function (require, exports, module) {

    var navigateItems = {
        items: [
            {
                name: "产品管理", action: "productManageModule",
                roles: ["lesseeAdmin", "productManager"],
                scope: ["platform", "company"],
                img: "js/plugins/treeview/images/nav_product.png",
                imgHover: "js/plugins/treeview/images/nav_product_hi.png",
                items: [
                    {name: "创建新产品", roles: ["lesseeAdmin", "productManager"], action: "newProduct"},
                    //{name: "创建新产品", roles: ["lesseeAdmin", "productManager"], action: "addNewProduct"},
                    {name: "待售产品库", roles: ["lesseeAdmin", "productManager"], action: "productList"},
                    {name: "在售产品库", roles: ["lesseeAdmin", "productManager"], action: "productSalesReport"},
                    {name: "已售产品库", roles: ["lesseeAdmin", "productManager"], action: "productSoldLibrary"},
                    //{name: "New Product", roles: ["lesseeAdmin", "productManager"], action: "newProduct"},
                ]
                //{name: "产品审核", action: "productVerify"}]
            },
            {
                name: "运营管理", action: "operationManageModule",
                scope: ["platform", "company"],
                roles: ["lesseeAdmin", "operationManager", "productManager"],
                img: "js/plugins/treeview/images/nav_op.png",
                imgHover: "js/plugins/treeview/images/nav_op_hi.png",
                items: [
                    //{name: "参销体系", action: "refSaleSystem"},
                    {
                        name: "预约管理",
                        roles: ["lesseeAdmin", "operationManager", "productManager"],
                        action: "reserveManage"
                    },
                    {name: "报单管理", roles: ["lesseeAdmin", "operationManager", "productManager"], action: "formManage"},
                    {
                        name: "业绩报告",
                        roles: ["lesseeAdmin", "operationManager", "productManager"],
                        action: "performReport"
                    },
                    //{name: "合同签发", roles: ["lesseeAdmin", "operationManager"], action: "contractSign"},
                    //{name: "合同归档", roles: ["lesseeAdmin", "operationManager"], action: "contractArchive"}
                ]
            },
            {
                name: "财务结算管理",
                roles: ["lesseeAdmin", "settleManager"],
                scope: ["platform", "company"],
                action: "finanStruManageModule",
                img: "js/plugins/treeview/images/nav_finan.png",
                imgHover: "js/plugins/treeview/images/nav_finan_hi.png",
                items: [
                    {name: "业绩报表", roles: ["lesseeAdmin", "settleManager"], action: "performTable"},
                    {name: "前端结算", roles: ["lesseeAdmin", "settleManager"], action: "frontSettle"},
                    {name: "后端结算", roles: ["lesseeAdmin", "settleManager"], action: "backEndSettle"}]
            },
            {
                name: "客户资源管理", action: "clientResManageModule",
                roles: ["lesseeAdmin", "teamCaptain", "channelManager"],
                scope: ["company"],
                img: "js/plugins/treeview/images/nav_cus.png",
                imgHover: "js/plugins/treeview/images/nav_cus_hi.png",
                items: [
                    {name: "线索池", roles: ["lesseeAdmin", "teamCaptain"], action: "leadPool"},
                    {name: "会员池", roles: ["lesseeAdmin"], action: "memberPool"},
                    {name: "合作渠道库", roles: ["lesseeAdmin", "channelManager"], action: "cooperationChannel"},
                    {name: "理财师客户统计", roles: ["lesseeAdmin", "teamCaptain"], action: "clientStatistic"}]
            },
            {
                name: "人员管理",
                roles: ["lesseeAdmin"],
                scope: ["company"],
                action: "userManageModule",
                id: "1",
                img: "js/plugins/treeview/images/nav_people.png",
                imgHover: "js/plugins/treeview/images/nav_people_hi.png",
                items: [
                    {name: "成员管理", roles: ["lesseeAdmin"], action: "memberManage"},
                    //{name: "组织架构定义", roles: ["lesseeAdmin"], action: "orgStructure"},
                    //{name: "企业通讯录管理", roles: ["lesseeAdmin"], action: "enterpriseContacts"},
                    {name: "用户角色管理", roles: ["lesseeAdmin"], action: "userRoleManage"},
                    {name: "离职管理", roles: ["lesseeAdmin"], action: "workChangeManage"}]
                //{name: "团队管理", roles: ["lesseeAdmin"], action: "teamManage"}]
            }
        ]
    };

    var actions = {
        //根据当前用户角色获取操作菜单
        getCurrentMenu: function () {
            var settings = require("./settings.js");
            var userRoles = settings.getCurrentRole();
            return {items: getMenuItems(navigateItems.items, userRoles, settings.loginUser, true)};
        }
    };

    //get menus
    var getMenuItems = function (items, userRoles, loginUser, isRoot) {
        var retval = [];
        if (userRoles != undefined && userRoles.length > 0) {
            $.each(items, function (i, item) {
                var itemRoles = item.roles;
                var isShow = $.grep(userRoles, function (userRole) {

                        return isRoot ? ($.inArray(loginUser.currentWorkSpace.name, item.scope) > -1 && (loginUser.is_manager ? true : $.inArray(userRole.role, itemRoles) > -1) ) :
                            ( loginUser.is_manager ? true : $.inArray(userRole.role, itemRoles) > -1);

                    }).length > 0;
                if (isShow) {
                    if (item.items != undefined) {
                        var childItems = getMenuItems(item.items, userRoles, loginUser);
                        item.items = childItems;
                    }
                    retval.push(item);
                }
            });
        }
        return retval;
    };


    module.exports = actions;
});