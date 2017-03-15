/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {

    //dot数据模板
    var doT=require("doT");
    require("JsHelper");
    //调用远程服务器获取数据
    var invokeServer = require("./business");

    /*页面事件*/
    var events = {
        common:function(){
        }
    };

    /*生成html flag=0,表示页面模板，flag=1表示tr模板*/
    var buildHtml = function (data, flag) {
        //理财师
        var users=data.users;
        var products=data.products;
        var orders=data.orders;
        var accounts=data.accounts;

        var tableData =[];
        $.each(orders,function(index,item){
            var info={
                proName:isNullOrEmpty(accounts[item.accountId])==true?"":products[item.productId].name,
                cusName:isNullOrEmpty(accounts[item.accountId])==true?"":accounts[item.accountId].name,
                price:item.amount,
                createdAt:getSmpFormatDate(new Date(item.createdAt), true),
                fundName:isNullOrEmpty(accounts[item.accountId])==true?"":users[item.createdBy].name,
                formId:item.id
            };
            tableData.push(info);
        });
        require("./css/index.css");
        if(flag==0){
            var htmlTpl = require("./tpl/index.html");
            var html = doT.template(htmlTpl)(tableData);
            return html;
        }
        else if(flag==1){
            var htmlTpl = require("./tpl/pagerTemp.html");
            var html = doT.template(htmlTpl)(tableData);
            return html;
        }
    };

    var render={
        toPage:function(curPageIndex,displayCount,flag){
            invokeServer.getOrderList(curPageIndex,displayCount,"desc","createdAt","","",function(data){
                $(".header .all").hide();
                if(flag=="0"){
                    $(".nav-bar ul").html('<li><a href="javascript:void(0)" class="nav-bar-res">预约管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有预约产品&gt;</a></li><li>所有产品所有团队预约</li>');
                }else if(flag=="1"){
                    $(".nav-bar ul").html('<li><a href="javascript:void(0)" class="nav-bar-res">预约管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有预约产品&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-team">所有团队预约&gt;</a></li><li>单产品所有团队预约</li>');
                }else if(flag=="2"){
                    $(".nav-bar ul").html('<li><a href="javascript:void(0)" class="nav-bar-res">预约管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有预约产品&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-team">所有团队预约&gt;</a></li><li>单产品当前团队预约</li>');
                }

                var html =buildHtml(data.info.body,0);
                $(".reserve-part").html(html);

                require("simpleSearch");
                $(".operation_search").simpleSearch({
                    searchField:[
                        {value:"source",text:"理财师或渠道"}
                    ],
                    callback:function(value,keyword){
                        alert(value+keyword);
                    }
                });

                //绑定事件
                events.common();

                //获取分页的总页数
                var allCount = parseInt(data.info.body.dataCount / 10);
                if (data.info.body.dataCount % 10 > 0) {allCount++;}
                require("PagerPath/customPager");
                $(".reserveMag_pager").customPager({
                    curPage:1,
                    allCount:allCount,
                    bindData:function(curPageIndex,displayCount, maxCount){
                        render.toTable(curPageIndex,displayCount);
                    }
                });

            },function(error){
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        },
        toTable: function (curPageIndex,displayCount) {
            invokeServer.getOrderList(curPageIndex,displayCount,"desc","createdAt","","",function(data){
                var trHtml =buildHtml(data.info.body,1);

                $(".reserveMag_table").find("tbody").fadeOut(500,function(){
                    $(this).html(trHtml).fadeIn(500);
                });

            });
        }
    };

    var actions = {
        //flag:0-所有产品所有团队预约，1-单产品所有团队预约，2-单产品单团队预约
        init:function(flag){
            render.toPage(1,10,flag);
        }

    };

    module.exports=actions;

});