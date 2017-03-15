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
    }, ".contractArch_table tbody>tr");

    //新增归档事件
    $("#menu_content").on("click", ".addArchive", function () {
        require("./css/addArch.css");
        var html = require("./tpl/addArch.html");
        //加载弹出层
        require("simpleShowDialog");
        $(window).simpleShowDialog({
            title: "新增归档信息",
            content: html,
            width: 500,
            height: 350,
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
            {name: "侯琪", product: "短融保4号（二十二期）", contractNum: "C0001", archiveNum: "A0151"},
            {name: "张磊", product: "五分贷 - 新手专享计划", contractNum: "C0091", archiveNum: "A0101"},
            {name: "刘彻", product: "恒宇天泽盈一号投资基金", contractNum: "C0301", archiveNum: "A0041"},
        ];
        var html = buildHtml(tableData, 0);
        require("./css/index.css");

        $("#menu_content").html(html);
        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".contractArch_pager").customPager({
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
            {name: "侯琪", product: "短融保4号（二十二期）", contractNum: "C0001", archiveNum: "A0151"},
            {name: "张磊", product: "五分贷 - 新手专享计划", contractNum: "C0091", archiveNum: "A0101"},
            {name: "刘彻", product: "恒宇天泽盈一号投资基金", contractNum: "C0301", archiveNum: "A0041"},
        ];
        var trHtml = buildHtml(tableData, 1);

        $(".contractArch_table").find("tbody").fadeOut(500, function () {
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