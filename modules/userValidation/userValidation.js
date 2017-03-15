/**
 * Created by chonglu.wang on 2015/8/11.
 */
define(function (require, exports, module) {

    require("jqueryCookie");
    var config = require("../foundation/settings");

    var actions = {
        loginCheck: function () {
            //get cookie，assignment to loginUser
            var loginUser = getLoginInfo();
            if (loginUser == undefined || loginUser == null) {
                $("#menu_navigate,#menu_content").html("");
                return false;
            } else {
                return true;
            }
        },
        toLogin: function () {
            require.async(["./css/login.css"], function () {

                $(".login_body").fadeIn("slow");

                var $loginForm = $(".content_login");
                //加载验证插件 并注册需要验证的输入框
                require("formValidation");
                var validate = $loginForm.find("input").simpleValidate();

                $loginForm.find(".login_submit").click(function () {
                    //提交验证
                    if (validate.formValidate()) {
                        var isLogin = logining($loginForm);
                        if (isLogin) {
                            window.location.href="index.html";
                        }
                        return isLogin;
                    }
                });

                $(window).on("keydown",function(event){
                    if(event.keyCode==13){
                        if($(".login_user").is(":focus") || $(".login_pwd").is(":focus")){
                            //提交验证
                            if (validate.formValidate()) {
                                var isLogin = logining($loginForm);
                                if (isLogin) {
                                    window.location.href="index.html";
                                }
                                return isLogin;
                            }
                        }
                    }
                });

            });
        },
        setLoginUserInfo: function () {
            var user = config.loginUser;
            $(".info_notice_people").html(user.name);
            $(".logo_company_name").html(user.company);
            $(".info_people_img").prop("src", user.icon);//setting current user

            //设置平台切换
            var targetSpace = config.workSpaces.company.name == config.loginUser.currentWorkSpace.name?
                config.workSpaces.platform:config.workSpaces.company;
            $("#change_work_space").text("切换到"+targetSpace.displayName).attr("data-target",targetSpace.name);
            $(".current_work_space").text(user.currentWorkSpace.displayName);

        },
        logout: function () {
            clearLoginInfo();
            this.gotoLoginPage();
        },
        gotoLoginPage: function () {
            window.location.href="login.html";
        },
        saveLoginInfo:function(configApi,choiceSpace){ saveLoginInfoImpl(configApi,choiceSpace); }
    };

    var logining = function ($form) {
        var account = $form.find(".login_user").val();
        var pwd = $form.find(".login_pwd").val();

        var $loginMsg = $form.find(".login_msg").html("登录中....");
        var requestData = undefined;
        var isLoginOk = true;
        $.ajax({
            url: config.api.login,
            async: false,
            type: "post",
            data: {passport: account, password: pwd},
            success: function (user) {
                requestData = user;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                isLoginOk = false;
            }
        });
        if (isLoginOk && (requestData != undefined && requestData.status == "0")) {
            var choiceSpace = $form.find(".choiceSpace:checked").val();
            config.loginUser = requestData;
            saveLoginInfoImpl(config,choiceSpace);
            $loginMsg.html("登录成功,跳转...");
            return true;
        } else {
            clearLoginInfo();
            var error = requestData != undefined?requestData.message:"登录失败";
            $loginMsg.html(error);
            return false;
        }
    };
    var saveLoginInfoImpl = function (configApi,choiceSpace) {
        if (configApi.loginUser.icon == "") {
            configApi.loginUser.icon = "images/users/user.gif";
        }
        //保存当前工作空间
        configApi.loginUser.currentWorkSpace = choiceSpace=="company"?configApi.workSpaces.company:configApi.workSpaces.platform;
        var loginStr = JSON.stringify(configApi.loginUser);
        $.cookie("mfyLogin", loginStr);
    };
    var getLoginInfo = function () {
        var loginStr = $.cookie("mfyLogin");
        if (loginStr != undefined && loginStr != null) {
            config.loginUser = JSON.parse(loginStr);
        } else {
            config.loginUser = undefined;
        }
        return config.loginUser;
    };
    var clearLoginInfo = function () {
        config.loginUser = undefined;
        $.removeCookie("mfyLogin");
    };

    module.exports = actions;

});