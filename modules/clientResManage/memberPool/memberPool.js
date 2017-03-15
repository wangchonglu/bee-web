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
    }, ".memberPool_table tbody>tr");

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
            {
                proName: "艾敬",
                source:"线索转化",
                fund: "银牌",
                income: "0",
                region: "13100001111",
                years: "AIJING@sina.com",
                company: "中国银行",
                position: "总经理",
                serviceWorkers: "江一燕",
                satisfaction: "普通",
            },
            {
                proName: "谭晶",
                source:"成交客户",
                fund: "银牌",
                income: "0",
                region: "15800001111",
                years: "TANJING@sina.com",
                company: "建设银行",
                position: "客户经理",
                serviceWorkers: "江一燕",
                satisfaction: "普通",
            }, {
                proName: "高天骐",
                source:"报备",
                fund: "银牌",
                income: "0",
                region: "18800001111",
                years: "GAOTIANQI@sina.com",
                company: "花旗银行",
                position: "客户经理",
                serviceWorkers: "梁荣忠",
                satisfaction: "普通",
            }
        ];
        var html = buildHtml(tableData, 0);
        require("./css/index.css");

        $("#menu_content").html(html);

        require("simpleSearch");
        $(".operation_search").simpleSearch({
            searchField:[
                {value:"source",text:"等级"},
                {value:"batch",text:"来源"},
                {value:"name",text:"服务人员"}
            ],
            callback:function(value,keyword){
                alert(value+keyword);
            }
        });

        $(".memberPool_pager").before("<div class='vipStatistics'>共有 <span class='vipNumber'> 3 </span> 位会员, 银牌:<span class='vipNumber'> 3 </span>位, 金牌:<span class='vipNumber'> 0 </span>位, 白金:<span class='vipNumber'> 0 </span>位<div>");
        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".memberPool_pager").customPager({
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
            {
                proName: "艾敬",
                source:"线索转化",
                fund: "A",
                income: "998",
                region: "13100001111",
                years: "AIJING@sina.com",
                company: "中国银行",
                position: "总经理"
            },
            {
                proName: "谭晶",
                source:"成交客户",
                fund: "C",
                income: "500",
                region: "15800001111",
                years: "TANJING@sina.com",
                company: "建设银行",
                position: "客户经理"
            }, {
                proName: "高天骐",
                source:"报备",
                fund: "B",
                income: "600",
                region: "18800001111",
                years: "GAOTIANQI@sina.com",
                company: "花旗银行",
                position: "客户经理"
            }
        ];
        var trHtml = buildHtml(tableData, 1);
        $(".memberPool_pager").before("<div class='vipStatistics'>共有 <span class='vipNumber'> 2 </span> 位会员, 银牌:<span class='vipNumber'> 1 </span>位, 金牌:<span class='vipNumber'> 1 </span>位, 白金:<span class='vipNumber'> 2 </span>位<div>")
        $(".memberPool_table").find("tbody").fadeOut(500, function () {
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