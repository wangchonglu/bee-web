/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT=require("doT");
    require("JsHelper");
    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    var foundSettings = require("../foundation/settings");

    //加载报单详情js
    var formDetail;
    require.async("./formDetail",function(fd){
        formDetail=fd;
    });

    /*缓存*/
    var cache = {
        //报单列表
        formList:[]
    };

    /*页面事件*/
    var events = {
        common:function(){
            //排序事件
            $(".form_manage").on("change", ".select_op_sort", function () {
                //这里调用排序接口
                alert("Do Sort");
            });

            //详情操作
            $(".form_manage").on("click", ".formDetail", function () {
                var $curTr=$(this);
                var id=$curTr.attr("data-val");
                var arr=cache.formList.filter(function(item){
                    return item.formId==id;
                });
                //var formDetail=require("./formDetail");
                formDetail.toPage(arr[0]);
            });

            //面包屑
            $(".form-main").on("click", ".nav-bar-curteam", function () {
                actions.init("2");
            });

            //注册报单详情里面的审核事件
            events.verify();
        },
        verify:function(){
            //报单审核返回按钮
            $(".form-part").on("click", ".verifiedReturn", function (event) {
                actions.init("1");
            });

            //报单审核下一个按钮
            $(".form-part").on("click", ".verifiedNext", function (event) {

                formDetail.toPage(cache.formList[0]);
            });
        }
    };

    /*工具*/
    var facilities = {
        /*生成html flag=0,表示页面模板，flag=1表示tr模板*/
        buildHtml: function (data, flag) {
            var products=data.info.body.products;
            //理财师
            var users=data.info.body.users;
            var forms=data.info.body.contracts;
            var accounts=data.info.body.accounts;
            //客户
            //var customers=data.info.body.accounts;
            var tableData =[];
            $.each(forms,function(index,item){
                var info={
                    proName:isNullOrEmpty(products[item.productId])==true?"":products[item.productId].name,
                    cusName:isNullOrEmpty(accounts[item.accountId])==true?"":accounts[item.accountId].name,
                    formPrice:item.amount,
                    price:item.refundAmount,
                    createAt:getSmpFormatDate(new Date(item.createdAt), true),
                    fundName:users[item.createdBy].name,
                    formId:item.id,
                    proNum:item.productId,
                    contractPicUrl:item.contractPicUrl,
                    accountIdPicUrl:item.accountIdPicUrl,
                    paySlipPicUrl:item.paySlipPicUrl,
                    bankCardPicUrl:item.bankCardPicUrl
                };
                tableData.push(info);
            });
            //缓存数据
            cache.formList=tableData;
            //var tableData =data;
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
        },
        checkRole:function(){
            var role=foundSettings.loginUser.roles.filter(function(item){
                return item.name.indexOf("审核经理")>=0;
            });
            if(role.length>0){
                return true;
            }
            return false;
        }
    };

    var render={
        toPage:function(curPageIndex,displayCount,flag){
            invokeServer.getApprovalList(curPageIndex,displayCount,function(data){
                $(".form-main .all").hide();
                if(flag=="0"){
                    $(".form-main .nav-bar").html('<ul><li><a href="javascript:void(0)">报单管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有报单产品&gt;</a></li><li>所有产品所有团队报单</li></ul>');
                }else if(flag=="1"){
                    $(".form-main .nav-bar").html('<ul><li><a href="javascript:void(0)">报单管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有报单产品&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-team">所有团队报单&gt;</a></li><li>单产品所有团队报单</li></ul>');
                }else if(flag=="2"){
                    $(".form-main .nav-bar").html('<ul><li><a href="javascript:void(0)">报单管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有报单产品&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-team">所有团队报单&gt;</a></li><li>单产品当前团队报单</li></ul>');
                }

                var html =facilities.buildHtml(data,0);
                require("./css/index.css");
                $(".form-part").html(html);
                //权限判断，非审核经理没有审核功能
                //if(!facilities.checkRole()){
                //    $(".form_verify").hide();
                //}
                //绑定事件
                events.common();

                require("simpleSearch");
                $(".operation_search").simpleSearch({
                    searchField:[
                        {value:"source",text:"理财师或渠道"}
                    ],
                    callback:function(value,keyword){
                        alert(value+keyword);
                    }
                });

                //获取分页的总页数
                var allCount = parseInt(data.info.body.dataCount / 10);
                if (data.info.body.dataCount % 10 > 0) {allCount++;}
                require("PagerPath/customPager");
                $(".formMag_pager").customPager({
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
            invokeServer.getApprovalList(curPageIndex,displayCount,function(data){

                var trHtml =facilities.buildHtml(data,1);

                $(".formMag_table").find("tbody").fadeOut(500,function(){
                    $(this).html(trHtml).fadeIn(500);
                    //权限判断，非审核经理没有审核功能
                    if(!facilities.checkRole()){
                        $(".form_verify").hide();
                    }
                });

            });
        }
    };

    var actions={
        //flag:0-所有产品所有团队预约，1-单产品所有团队报单，2-单产品单团队报单
        init:function(flag){
            render.toPage(1,10,flag);
        }
    };

    module.exports=actions;
});