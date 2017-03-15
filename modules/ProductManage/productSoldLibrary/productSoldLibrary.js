/**
 * Created by Frey on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    var invokeServer = require("../productList/business");
    var foundSettings = require("../foundation/settings");

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
    }, ".prosales_table tbody>tr");

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
        var tableData = [{
            id: "10000430",
            proName: "富裕基金 - 富裕天成红利混合",
            fund: "40",
            income: "500",
            years: "100",
            proType: "信托",
            sales: 80,
            deadLine: "2015-9-7",
        },
            {
                id: "10000611",
                proName: "金储 - 50天理财项目",
                fund: "60",
                income: "1000",
                years: "150",
                proType: "资产",
                sales: 97,
                deadLine: "2015-9-10",
            },
            {
                id: "10000431",
                proName: "五分贷 - 新手专享计划",
                fund: "80",
                income: "800",
                years: "90",
                proType: "私募",
                sales: 138,
                deadLine: "2015-9-6",
            }
        ];
        var html = buildHtml(tableData, 0);

        require("./css/index.css");

        $("#menu_content").html(html);
        productListEvents.clickRow();
        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".prosales_pager").customPager({
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
        var tableData = [{
            id: "10000430",
            proName: "富裕基金 - 富裕天成红利混合",
            fund: "40",
            income: "500",
            years: "100",
            proType: "信托",
            sales: 80,
            deadLine: "2015-9-7",
        },
            {
                id: "10000611",
                proName: "金储 - 50天理财项目",
                fund: "60",
                income: "1000",
                years: "150",
                proType: "资产",
                sales: 97,
                deadLine: "2015-9-10",
            },
            {
                id: "10000431",
                proName: "五分贷 - 新手专享计划",
                fund: "80",
                income: "800",
                years: "90",
                proType: "私募",
                sales: 138,
                deadLine: "2015-9-6",
            }
        ];
        var trHtml = buildHtml(tableData, 1);

        $(".prosales_table").find("tbody").html(trHtml);
        productListEvents.clickRow();

    };

    //查看详情
    var ProductDetail = function (currentObj) {
        //构造查询单个产品所需参数
        var productNumber = $(currentObj).attr("data-id");
        //var productNumber = $(this).attr("data-id");
        var reqData = {token: foundSettings.loginUser.token, id: productNumber};
        require.async(["doT", "../productList/css/popDetails.css", "popupLayer"], function (doT, conTem, conCss, popup) {
            var html = require("../productList/tpl/popDetails.html");
            invokeServer.getProductInfo(reqData,
                function (resultData) {
                    if (resultData.status == 0) {
                        //构造页面所需函数
                        var infoBase = resultData.info.body.product.base;
                        var infoFixed = resultData.info.body.product.fixed;
                        var infoAuditors = resultData.info.body.product.auditors;
                        var scheme = resultData.info.body.product.scheme;
                        for (var prop in infoBase) {
                            infoBase[prop] == undefined ? infoBase[prop] == "" : prop;
                        }
                        for (var prop in infoFixed) {
                            infoFixed[prop] == undefined ? infoFixed[prop] == "" : prop;
                        }
                        for (var prop in infoAuditors) {
                            infoAuditors[prop] == undefined ? infoAuditors[prop] == "" : prop;
                        }
                        for (var prop in scheme) {
                            infoAuditors[prop] == undefined ? scheme[prop] == "" : prop;
                        }
                        infoBase.productType == 1 ? infoBase.productType = "信托" : "";
                        infoBase.productType == 2 ? infoBase.productType = "资产" : "";
                        infoBase.productType == 3 ? infoBase.productType = "私募" : "";
                        infoBase.productType == 4 ? infoBase.productType = "其它" : "";

                        infoBase.benefitType == 1 ? infoBase.benefitType = "固定" : "";
                        infoBase.benefitType == 2 ? infoBase.benefitType = "浮动" : "";
                        infoBase.benefitType == 3 ? infoBase.benefitType = "固定+浮动" : "";

                        infoBase.investType == 1 ? infoBase.investType = "房地产" : "";
                        infoBase.investType == 2 ? infoBase.investType = "工商企业" : "";
                        infoBase.investType == 3 ? infoBase.investType = "PE/VC" : "";
                        infoBase.investType == 4 ? infoBase.investType = "新三板" : "";
                        infoBase.investType == 5 ? infoBase.investType = "打新" : "";
                        infoBase.investType == 6 ? infoBase.investType = "定增" : "";
                        infoBase.investType == 7 ? infoBase.investType = "二级市场－》股票型" : "";
                        infoBase.investType == 8 ? infoBase.investType = "其它" : "";


                        var item = {
                            name: infoBase.productName,
                            productType: infoBase.productType,
                            benefitType: infoBase.benefitType,
                            raiseTotal: infoBase.raiseTotal,
                            investmentDeadline: infoBase.investmentDeadline,
                            annualBenefitRate: infoBase.annualBenefitRate ? JSON.parse(infoBase.annualBenefitRate) : "",
                            rebateRatio: infoBase.rebateRatio,
                            id: infoBase.id,
                            shortName: infoBase.shortName,
                            financingParty: infoBase.financingParty,
                            investType: infoBase.investType,
                            investmentManager: infoBase.investmentManager,
                            investmentAdviser: infoBase.investmentAdviser,
                            productDistribution: infoBase.productDistribution,
                            raiseBank: infoBase.raiseBank,
                            raiseAccount: infoBase.raiseAccount,
                            raiseAccountName: infoBase.raiseAccountName,
                            trusteeBank: infoBase.trusteeBank,
                            entrustBank: infoBase.entrustBank,
                            raiseTotalRemark: infoBase.raiseTotalRemark,
                            investmentDeadlineRemark: infoBase.investmentDeadlineRemark,
                            beginPayTime: infoBase.beginPayTime,
                            lastPayTime: infoBase.lastPayTime,
                            distributionTime: infoBase.distributionTime,
                            createTime: infoBase.createTime,
                            beginForecastTime: infoBase.beginForecastTime,
                            lastForecastTime: infoBase.lastForecastTime,
                            beginWarmupTime: infoBase.beginWarmupTime,
                            lastWarmupTime: infoBase.lastWarmupTime,
                            fundType: infoBase.fundType,
                            isPromote: infoBase.isPromote,
                            contract: infoBase.contract,
                            productPicture: infoBase.productPicture,
                            createUserId: infoBase.createUserId,
                            tranchePoint: infoBase.tranchePoint,
                            feature: infoBase.feature,
                            repaymentSource: infoBase.repaymentSource,
                            trustMeasure: infoBase.trustMeasure,
                            interestPayType: infoFixed.interestPayType,
                            distributionType: infoFixed.distributionType,
                            packagePrice: infoFixed.packagePrice,
                            distributionPrice: infoBase.distributionPrice,
                            distributionPlan: infoBase.distributionPlan,
                            auditor1: infoAuditors.auditor1,
                            auditor2: infoAuditors.auditor2,
                            auditor3: infoAuditors.auditor3,
                            holdTotal: scheme.holdTotal,
                        };
                        html = doT.template(html)(item);
                        //加载弹出层
                        require("simpleShowDialog");
                        $(window).simpleShowDialog({
                            title: "产品详情信息",
                            content: html,
                            width: 900,
                            height: 550,
                            actions: ["close"],
                            onSubmit: function () {
                                /*
                                 var code = $("input[name=departmentCode]").val();
                                 var name = $("input[name=departmentName]").val();
                                 var pid = $("input[name=superiorDepartment]").attr("data-val");
                                 var type = "1";
                                 //这里调用添加员工接口
                                 */

                                return true;
                            }
                        });
                    }
                },
                function () {
                });

        });
    }

    //表格内事件
    var productListEvents = {
        //点击行
        clickRow: function () {
            $(".prosales_content").on("click", ".prosales_table tbody tr", function () {
                ProductDetail(this);
            });
        }
    }

    var actions = {
        init: function () {
            bindDataToPage(1, 10);
        }
    };

    module.exports = actions;
});