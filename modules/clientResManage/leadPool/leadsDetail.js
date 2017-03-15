/**
 * Created by Moment on 2015/8/21.
 */
define(function (require, exports, module) {
    var doT = require("doT");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //Cache
    var cacheData = {
        seaId:""
    };

    /*渲染页面*/
    var render = {
        toPage: function () {
            require("./css/detail.css");
            var htmlTemp=require("./tpl/detail.html");
            invokeServer.getLeadsPoolList(cacheData.seaId,1,10,2,function(data){
                var html=doT.template(htmlTemp)(data.leads.records);
                $("#menu_content").html(html);

                //获取分页的总页数
                var allCount = parseInt(data.leads.dataCount / 10);
                if (data.leads.dataCount % 10 > 0) { allCount++; }
                require("PagerPath/css/customPager.css");
                require.async("PagerPath/customPager", function () {
                    $(".leadPool_detail_pager").customPager({
                        curPage: 1,
                        allCount: allCount,
                        bindData: function (curPageIndex, displayCount, maxCount) {
                            render.toTable(curPageIndex, displayCount);
                        }
                    })
                });
            });
        },
        toTable:function(pageIndex,displayCount){
            invokeServer.getLeadsPoolList(cacheData.seaId,pageIndex,displayCount,2,function(data){
                var htmlTemp=require("./tpl/pagerTemp.html");
                var trHtml=doT.template(htmlTemp)(data.leads.records);
                $(".leadPool_detail").find("tbody").fadeOut(500, function () {
                    $(this).html(trHtml).fadeIn(500);
                });
            });
        }
    };

    //初始化，加载数据 这里需要调用接口
    var actions = {
        init: function (seaId) {
            cacheData.seaId=seaId;
            render.toPage();
        }
    };

    module.exports = actions;
});