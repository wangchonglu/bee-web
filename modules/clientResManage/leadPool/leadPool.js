/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");
    var foundSettings = require("../foundation/settings");

    var actions = {
        init: function () {
            var role=foundSettings.loginUser.roles.filter(function(item){
                return item.name.indexOf("管理员")>=0;
            });
            if(role.length>0){
                var admin =require("./admin");
                admin.init();
            }
            else{
                var teamLeader=require("./teamLeader");
                teamLeader.init();
            }
        }
    };

    module.exports = actions;
});