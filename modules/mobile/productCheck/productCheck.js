define(function (require, exports, module) {

    require("./css/formDetail.css");
    require("zepto");
    var globalSetting = require("globalSetting");

    function ajaxRequest(url, type, reqData, callback, errorcall) {
        // $.support.cors = true;
        $.ajax({
            type: type,
            url: url,
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if (data.status == 0 && $.isFunction(callback)) {
                    callback(data);
                }
                else if ($.isFunction(errorcall)) {
                    errorcall(data);
                }
            },
            error: function (XMLHttpRequest) {
                if ($.isFunction(errorcall)) {
                    errorcall(XMLHttpRequest);
                }
            }
        });
    }

    var actions = {
        initData: function () {

            var url = globalSetting.api.baseServer + "/report/report-info";
            var reqData = {
                token: actions.getUrlParameter("token"),
                id: actions.getUrlParameter("id")
            };


            ajaxRequest(url, "GET", reqData, function (data) {
                //items
                var item = data.info.body;
                var report = item.report;
                var accountuser = item.accounts[report.accountId];
                var financialPlanner = item.users[report.createdBy];
                var product = item.products[report.productId];

                var retData = {
                    id: product.id,
                    name: product.name,
                    userName: accountuser.name,
                    reportAmount:report.amount,
                    reportTime: new Date(report.createdAt).toLocaleDateString(),
                    financialPlanner: financialPlanner.name,
                   // financialPlannerPhone: "",
                    cont: report.contractPicUrl,
                    cardPicture: report.accountIdPicUrl,
                    payMoney: report.paySlipPicUrl,
                    bankCard: report.bankCardPicUrl
                };

                var doT = require("doT");
                var tpl = require("./tpl/tpl.html");
                var html = doT.template(tpl)(retData);
                $("body").html(html);

                var deviceWidth = $(window).width();
                $(".wrapper,.wrapper2").width(deviceWidth);
                if ($(".select-style").val() == 1) {
                    $(".formNum").show()
                }

                $(".wrapper2").on("change", ".select-style", function () {
                    var selected = $(".select-style").val();
                    if (selected == 1) {
                        $(".formNum").show()
                    } else {
                        $(".formNum").hide();
                        $(".inputVal").val("");
                    }
                });

                $(".tex-btn").click(function () {
                    $(".father-content").animate({"margin-left": (0 - deviceWidth) + "px"});
                    window.document.body.scrollTop = 0;
                    actions.initEvent();
                });
                $(".nav-return").click(function () {
                    $(".father-content").animate({"margin-left": "0px"})
                });

            }, function () {
                alert("获取数据异常");
            });

        },
        initEvent: function () {
            $(".confirm-btn").click(function(){
                var url = globalSetting.api.baseServer + "/report/verify"
                var reqData = {
                    token: actions.getUrlParameter("token"),
                    id: actions.getUrlParameter("id"),
                    status:$(".select-style").val(),
                    opinion:$(".textareaStyle").val()
                    };
                ajaxRequest(url,'POST',reqData,function(data){
                   if(data.status == "0"){
                       alert(data.message);
                   }
                },function(){
                    alert("获取数据异常");
                })
            })
        },


        getUrlParameter: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2];
            return null;
        },

        getLocalTime : function(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        }


};


    actions.initData();



})










