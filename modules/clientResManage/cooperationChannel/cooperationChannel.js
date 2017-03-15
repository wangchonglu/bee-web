/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    var cache={
        tab:"stitude"
    };
    var events={
        common:function(){

            //点击TAB事件
            $(".coop_channel").on("click", ".tab-content li", function (event) {
                if($(this).hasClass("cha-stitude")){
                    cache.tab="stitude";
                    $(".cha-stitude").addClass("select");
                    $(".cha-stitude").siblings().removeClass("select");

                    bindDataToPage(1,10,"stitude");

                }
                else if($(this).hasClass("cha-person")){
                    cache.tab="person";
                    bindDataToPage(1,10,"person");
                    $(".cha-person").addClass("select");
                    $(".cha-person").siblings().removeClass("select");
                }

            });
        }
    };


    var facilities={
        isNullOrEmpty:function(obj){
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        },
        formatNullField:function(obj){
            if (obj == undefined || obj == null || obj == "") {
                return "";
            }
            else {
                return obj;
            }
        },
        //生成html flag=0,表示页面模板，flag=1表示tr模板
        buildHtml:function(data, flag){
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
    };


    //绑定数据函数，渲染页面
    var bindDataToPage = function (curPageIndex, displayCount,tab) {
        var tableData =[];
        if(tab=="stitude"){
            tableData = [
                {
                    proName: "何斌",
                    fund: "机构",
                    income: "18837463382",
                    region: "产品经理",
                    years: "750",
                    zone: "华东区",
                    funderCount: "5",
                    serviceMan:"张经理"
                },
                {
                    proName: "刘志",
                    fund: "机构",
                    income: "13788974462",
                    region: "销售经理",
                    years: "1200",
                    zone: "华东区",
                    funderCount: "5",
                    serviceMan:"张经理"
                }

            ];
        }else{
            tableData = [
                {
                    proName: "王琳",
                    fund: "个人",
                    income: "13178249483",
                    region: "个人",
                    years: "1000",
                    zone: "华东区",
                    funderCount: "5",
                    serviceMan:"张经理"
                }

            ];
        }

        var html = facilities.buildHtml(tableData, 0);
        require("./css/index.css");

        $("#menu_content").html(html);
        events.common();

        require("simpleSearch");
        $(".operation_search").simpleSearch({
            searchField:[
                {value:"area",text:"地域"}
            ],
            callback:function(value,keyword){
                alert(value+keyword);
            }
        });

        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
            $(".coopChannel_pager").customPager({
                curPage: 1,
                allCount: 10,
                bindData: function (curPageIndex, displayCount, maxCount) {
                    bindDataToTable(curPageIndex, displayCount,cache.tab);
                }
            });
        });

    };

    //渲染分页绑定事件
    var bindDataToTable = function (curPageIndex, displayCount,tab) {
        var tableData = [
            {
                proName: "王琳",
                fund: "个人",
                income: "13178249483",
                region: "个人",
                years: "1000",
                zone: "华东区",
                funderCount: "5",
                serviceMan:"张经理"
            },
            {
                proName: "何斌",
                fund: "机构",
                income: "18837463382",
                region: "产品经理",
                years: "750",
                zone: "华东区",
                funderCount: "5",
                serviceMan:"张经理"
            },
            {
                proName: "刘志",
                fund: "机构",
                income: "13788974462",
                region: "销售经理",
                years: "1200",
                zone: "华东区",
                funderCount: "5",
                serviceMan:"张经理"
            }

        ];
        var trHtml = facilities.buildHtml(tableData, 1);

        $(".coopChannel_table").find("tbody").fadeOut(500, function () {
            $(this).html(trHtml).fadeIn(500);
        });
    };

    var actions = {
        init: function () {
            bindDataToPage(1, 10,"stitude");
        }
    };

    module.exports = actions;
});