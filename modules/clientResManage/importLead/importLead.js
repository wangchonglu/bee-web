/**
 * Created by 雯涛 on 2015/8/3.
 */
define(function (require, exports, module) {
    var staticData;
    var importformdiv='<div class="leadformline">\
    <table>\
    <tr>\
    <td>\
    姓名\
    </td>\
    <td>\
    <input type="text">\
        </td>\
        <td>\
        手机\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        <td>\
        邮箱\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        </tr>\
        <tr>\
        <td>\
        职位\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        <td>\
        公司\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        <td>\
        标签\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        </tr>\
        </table>\
        <table>\
        <tr>\
        <td>\
        线索所在地区\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        <td>\
        备注\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        </tr>\
        <tr>\
        <td>\
        线索来源\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        <td>\
        头像\
        </td>\
        <td>\
        <input type="text">\
        </td>\
        </tr>\
        </table>\
        </div>';
    $("#menu_content").on("click", ".toformimport", function () {
        $(".fileimport").hide();
        $(".formimport").show();
    });
    $("#menu_content").on("click", ".tofileimport", function () {
        $(".formimport").hide();
        $(".fileimport").show();
    });
    $("#menu_content").on("click", ".more", function () {
        var importform=$(importformdiv);
        $(".leadformlist").append(importform);
    });
    $("#menu_content").on("click", ".less", function () {
        if($(".leadformlist .leadformline").length>1) $(".leadformlist .leadformline:last").remove();
    });
    //初始化，加载数据 这里需要调用接口
    var init=function(){
        var doT = require("doT");
        var htmlTpl = require("./tpl/index.html");
        var tableData = {
        };
        staticData=tableData;
        var html = doT.template(htmlTpl)(tableData);
        require("./css/importLeads.css");
        $("#menu_content").html(html);
    };
    exports.init=init;
});