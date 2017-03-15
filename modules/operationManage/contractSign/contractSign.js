/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //鼠标经过事件
    $("#menu_content").on({
        mouseover: function () {
            $(this).removeClass("trEvenBackColor");
            $(this).removeClass("trOddBackColor");
            $(this).addClass("trMouseover");
        },
        mouseout: function () {
            $(this).removeClass("trMouseover");
            $(".prosales_table tr:even").addClass("trEvenBackColor");
            $(".prosales_table tr:odd").addClass("trOddBackColor");
        }
    }, ".contractSign_table tbody>tr");

    //回车键搜索事件
    $("#menu_content").on("focus", ".contract_sign .search_btn", function () {
        $(this).keydown(function (event) {
            if (event.keyCode == 13) {
                //这里调用搜索接口
                alert("Do Search");
            }
        });
    });

    //点击搜索事件
    $("#menu_content").on("click", ".contract_sign .search_img", function () {
        //这里调用搜索接口
        alert("Do Search");
    });

    //确认签发
    $("#menu_content").on("click", ".contract_sign .confirm_send", function () {
        require("./css/confirmSign.css");
        var html = require("./tpl/confirmSign.html");
        //加载弹出层
        require("simpleShowDialog");
        $(window).simpleShowDialog({
            title: "确认签发",
            content: html,
            width: 500,
            height: 250,
            actions: ["submit", "cancel"],
            onSubmit: function () {

            }
        });
    });

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    };

    //处理空字段 为null 和 undefined 情况
    function formatNullField(obj, field) {
        if (obj == undefined || obj == null || obj == "") {
            return "";
        }
        else {
            return obj;
        }
    }

    //生成html flag=0,表示页面模板，flag=1表示tr模板
    function buildHtml(data, flag) {
        var tableData = data;
        if (flag == 0) {
            var htmlTpl = require("./tpl/index.html");
            var html = doT.template(htmlTpl)(tableData);
            return html;
        }
        else if (flag == 1) {
            var htmlTpl = require("./tpl/pagerTemp.html");
            var html = doT.template(htmlTpl)(tableData);
            return html;
        }
    }

    //绑定数据函数，渲染页面
    var bindDataToPage = function (curPageIndex, displayCount) {
        var tableData = [
            {proName: "短融保4号（二十二期）", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "已发送", isSend: true},
            {proName: "五分贷 - 新手专享计划", fund: "基金二号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: false},
            {proName: "弘酬永泰私募基金", fund: "基金三号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: true},
            {proName: "恒宇天泽盈一号", fund: "基金四号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: false}
        ];
        var html = buildHtml(tableData, 0);
        require("./css/index.css");
        $("#menu_content").html(html);
        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".contractSign_pager").customPager({
                curPage: 1,
                allCount: 10,
                bindData: function (curPageIndex, displayCount, maxCount) {
                    bindDataToTable(curPageIndex, displayCount);
                }
            });
        });

    };

    //渲染分页绑定事件
    var bindDataToTable = function (curPageIndex, displayCount) {
        var tableData = [
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "已发送", isSend: true},
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: false},
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: false},
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "未发送", isSend: false},
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "已发送", isSend: true},
            {proName: "理财一号", fund: "基金一号", region: "上海市浦东新区陆家嘴", years: "已发送", isSend: true}
        ];
        var trHtml = buildHtml(tableData, 1);

        $(".contractSign_table").find("tbody").fadeOut(500, function () {
            $(this).html(trHtml).fadeIn(500);
        });
    };

    var actions = {
        init: function () {
            bindDataToPage(1, 10);
        }
    };

    module.exports = actions;
});