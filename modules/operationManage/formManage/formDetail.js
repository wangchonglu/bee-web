/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {

    //dot数据模板
    var doT=require("doT");
    //require("JsHelper");
    //调用远程服务器获取数据
    var invokeServer = require("./business");


    /*页面事件*/
    var events = {
        common:function(){
            //查看大图
            $(".form-detail").on("click", ".viewImage", function () {
                var title = $(this).attr("data-text");
                require("simpleShowDialog");
                $(window).simpleShowDialog({
                    title: title,
                    content: $(this).parent().html(),
                    width:650,
                    height:450,
                    actions:["ok"],
                    isShowAction:false,
                    onSubmit:function(){
                        //这里调用添加员工接口
                        return true;
                    }
                });

                $(".cfyPopuplay_body .viewImage").css({
                    "width":$(".cfyPopuplay_body").width()-20,
                    "height":$(".cfyPopuplay_body").height()-20
                });
            });

            //审核按钮
            $(".form-detail").on("click", ".verifyBtn", function () {
                $(".verify-content").animate({
                    "bottom":"0"
                },200);
                events.verify();
                invokeServer.getApprovalList();
            });
        },
        //审核之前的事件
        verify:function() {
            //报单审核操作
            $(".verify-content").on("change", ".verifyStatus", function () {
                var text = $(this).val();
                $(".real-price").hide();
                $(".verify-opinion").hide();
                $(".real-price-input").val("placeHolder");
                $(".verifyOpinion").val("placeHolder");
                $(".verifyOk").removeAttr("disabled");
                $(".verifyOk").removeClass("disable");
                if (text == "3") {
                    $(".real-price-input").val($("span[data-field='formPrice']").text());
                    $(".real-price").show();
                } else if (text == "2") {
                    $(".verifyOpinion").val("");
                    $(".verify-opinion").show();
                    $(".verifyOk").attr('disabled',"true");
                    $(".verifyOk").addClass("disable");
                }
            });

            //审核意见文本框输入改变事件
            $(".verify-content").on("input propertychange", ".verifyOpinion", function () {
                if($(this).val()==""){
                    $(".verifyOk").attr('disabled',"true");
                    $(".verifyOk").addClass("disable");
                }else{
                    $(".verifyOk").removeAttr("disabled");
                    $(".verifyOk").removeClass("disable");
                }
            });

            //报单审核取消按钮
            $(".verify-content").on("click", ".verifyCancel", function () {
                $(".verify-content").animate({
                    "bottom": "-300px"
                }, 200);
            });

            //报单审核确认按钮
            $(".verify-content").on("click", ".verifyOk", function (event) {
                var price =$("span[data-field='formPrice']").text();
                var id = $(".form-detail").attr("data-id");
                var status = $(".verifyStatus").val();
                var text = $(".verifyStatus option:selected").text();
                var opinion = $(".verifyOpinion").val();

                var payAmount = undefined;
                if (status == "3") {
                    payAmount = $(".real-price-input").val();
                }
                //invokeServer.reportVerify(id, status, opinion, payAmount, function (data) {
                //
                //}, function (error) {
                //});
                //审核成功，修改报单的状态
                $(".verify-content").animate({
                    "bottom": "-300px"
                }, 200);
                $(".verified").show();
                $(".verifyBtn").hide();
                $(".verified-info .status").text(text);
                $(".verified-info .payPrice").text(payAmount);
                events.verified();
            });
        },
        //审核之后的事件
        verified:function(){
            //报单审核修改按钮
            $(".form-verify").on("click", ".verifiedEdit", function (event) {
                $(".verify-content").animate({
                    "bottom":"0"
                },200);
            });
            //报单审核返回 事件 &&& 报单审核下一个 事件
            //在formList.js中
        }
    };

    var render={
        toPage:function(data){
            $(".form-main .all").hide();
            $(".form-main .nav-bar").html('<ul><li><a href="javascript:void(0)">报单管理&gt;</a> </li>  <li><a href="javascript:void(0)" class="nav-bar-product">所有报单产品&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-team">所有团队报单&gt;</a></li><li><a href="javascript:void(0)" class="nav-bar-curteam">单产品当前团队报单&gt;</a></li><li>当前产品详情</li></ul>');

            require("./css/formDetail.css");
            var html=require("./tpl/formDetail.html");
            html =doT.template(html)(data);
            $(".form-part").html(html);
            $(".form-detail").attr("data-id",data.formId);
            events.common();
        }
    };

    module.exports=render;

});