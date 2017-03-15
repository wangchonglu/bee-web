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
            $(".formMag_table tr:even").addClass("trEvenBackColor");
            $(".formMag_table tr:odd").addClass("trOddBackColor");
        }
    }, ".clientStati_table tbody>tr");

    //详情操作
    $("#menu_content").on("click", ".clientStati_table .img_detail", function () {
        var $curTr = $(this).parent().parent();
        var jsonObj = {addOrEdit: 1};
        require.async(["doT", "./tpl/formDetail.html", "./css/formDetail.css", "popupLayer"], function (doT, conTem, conCss, popup) {
            var html = doT.template(conTem)(jsonObj);

            //加载弹出层
            require("simpleShowDialog");
            $(window).simpleShowDialog({
                title: "报单详情信息",
                content: html,
                width: 650,
                height: 550,
                actions: ["ok"],
                onSubmit: function () {
                    //这里调用添加员工接口
                    return true;
                }
            });
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
            {proName: "梁荣忠", fund: "销售部", income: "lrz@sina.com", region: "13100001222", years: "78"},
            {proName: "潘安邦", fund: "销售部", income: "anbang@sina.com", region: "13100001333", years: "50"},
            {proName: "金艳芳", fund: "销售部", income: "jinyanfang@sina.com", region: "13100004444", years: "48"},
            {proName: "杨一展", fund: "销售部", income: "yyizhan@sina.com", region: "13100005555", years: "46"},
        ];
        var html = buildHtml(tableData, 0);
        require("./css/index.css");
        $("#menu_content").html(html);
        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".clientStati_pager").customPager({
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
            {proName: "梁荣忠", fund: "销售部", income: "lrz@sina.com", region: "13100001222", years: "78"},
            {proName: "潘安邦", fund: "销售部", income: "anbang@sina.com", region: "13100001333", years: "78"},
            {proName: "金艳芳", fund: "销售部", income: "jinyanfang@sina.com", region: "13100004444", years: "78"},
            {proName: "杨一展", fund: "销售部", income: "yyizhan@sina.com", region: "13100005555", years: "78"},
        ];
        var trHtml = buildHtml(tableData, 1);

        $(".clientStati_table").find("tbody").fadeOut(500, function () {
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