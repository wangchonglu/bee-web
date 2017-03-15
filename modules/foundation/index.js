/**
 * Created by chonglu.wang on 2015/7/28.
 */

define(function (require, exports, module) {

    require("jquery");
    $.support.cors = true;

    //常用组件异步加载
    require.async(["jqueryPlaceholder", "JsHelper", "jqueryJson","jqueryRollbar"]);

    //加载首页的css
    require.async("modulesCommPath/css/index.css", function () {
        $("body").fadeIn();
    });

    //我的工作平台下拉事件初始化
    var initMySpaceEvent = function () {

        //点击切换平台
        $("#change_work_space").on("click", function () {
            var config = require("./settings.js");
            var currentSpace = config.loginUser.currentWorkSpace;//当前工作平台
            config.loginUser.currentWorkSpace = currentSpace.name == config.workSpaces.platform.name ? config.workSpaces.company : config.workSpaces.platform;
            var userValidation = require("../userValidation/userValidation");
            userValidation.saveLoginInfo(config, config.loginUser.currentWorkSpace.name);
            window.location.reload();
        });
    };

    var actions = {
        init: function () {
            var userValidation = require("../userValidation/userValidation");
            if (userValidation.loginCheck() == true) {
                initImpl(userValidation);
            } else {
                userValidation.gotoLoginPage();
            }
        }
    };

    var initImpl = function (userValidation) {

        //设置main_content高度
        var minHight = $(window).height() - 80;
        $(".main_content").css("min-height", minHight);

        $(".bee_web").fadeIn();

        //设置登录信息
        userValidation.setLoginUserInfo();
        //加载导航栏
        require("treeViewPath/css/simpleTreeView.css");
        require.async(["doT", "treeViewPath/simpleTreeView"], function (doT, treeView) {

            var menuImpl = require("./menu-settings.js");
            //根据登录用户权限获取操作菜单
            var navigateData = menuImpl.getCurrentMenu();

            //初始化操作导航菜单
            $("#menu_navigate").simpleTreeView({
                data: navigateData,
                template: "<span data-id='{id}' action='{action}' >{name}</span>",
                select: function (target) {
                    //模块action
                    var action = $(target).find("span").attr("action");
                    if (action != null && action != undefined && action != '') {
                        require.async(action, function (target) {
                            if (target != null && $.isFunction(target.init)) {
                                //加载等待弹出层
                                require.async("waitloading", function (waitloading) {
                                    waitloading.show($("#menu_content"));
                                    target.init();
                                });
                            } else {
                                $("#menu_content").html("<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><center>该功能模块正在开发中</center>");
                            }
                        });
                    } else {

                    }

                }
            });

            //填满屏幕
            $("#menu_content").height($(window).height()-$(".index_header").height());

            $(window).resize(function(){
                $("#menu_content").height($(window).height()-$(".index_header").height());
            });
        });

        $(".logoff").on("click", function () {
            userValidation.logout();
        });
        //console.log("欢迎进入蜜蜂云管理平台！！\n\n\n\n\n\n\n\n\n");
    };

    initMySpaceEvent();

    module.exports = actions;

});

