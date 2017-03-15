/**
 * Created by Moment on 2015/9/15.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    /*工具*/
    var facilities = {
        isNullOrEmpty: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /*处理空字段 为null 和 undefined 情况*/
        formatNullField: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return "";
            }
            else {
                return obj;
            }
        }
    };

    //操作
    var actions={
        show:function(uid){
            invokeServer.getUserDetail(uid,function(data){
                var curUser = data.list;
                var curName = facilities.formatNullField(curUser.name);
                var curPhone = facilities.formatNullField(curUser.loginName);
                var curEmail = facilities.formatNullField(curUser.email);
                var curImage = facilities.formatNullField(curUser.image);
                if(curImage==""){
                    curImage="./modules/foundation/image/default-picture.png";
                }
                var curAddr = facilities.formatNullField(curUser.address);
                var curIdCardImg = facilities.formatNullField(curUser.id_card_img);
                if(curIdCardImg==""){
                    curIdCardImg="./modules/foundation/image/default-picture.png";
                }

                var jsonObj = { name: curName, phone: curPhone, email: curEmail, image: curImage,  addr: curAddr, idcardimg: curIdCardImg };
                require.async(["./tpl/popUserDetail.html", "./css/popUserDetail.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)(jsonObj);
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "员工详情信息",
                        content: html,
                        width: 650,
                        height: 500,
                        actions: ["close"],
                        onSubmit: function () {
                            return true;
                        }
                    });
                });
            },function(error){

            });
        }
    };

    module.exports = actions;
});