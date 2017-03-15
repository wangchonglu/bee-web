/**
 * Created by hello on 2015/8/19.
 修改图片上传成功
 */

define(function (require, exports, module) {

    //产品经理
    var productManager = "";
    //渠道经理
    var ditchManager = "";
    //审核经理
    var auditManager = "";
    //结算经理
    var closingManager = "";
    //上传图片路径
    var productImgUrl = "";
    //是否是上一步
    var isLastStep = false;

    var invokeServer = require("./business");
    var role = require("userRolePath/userRoleManage/business");
    var foundSettings = require("../foundation/settings");
    require("autoCompletePath/autoComplete");
    //提交申请
    var submitApply = function () {
        //提交
        $(".createProduct").on("click", ".commits", function () {
            require("datepickerPath/jquery.datetimepicker.min");
            var productJson = {
                "auditor1": $("#ditch-manager").attr("data-val"), //渠道经理
                "auditor2": $("#audit-manager").attr("data-val"), // 审核经理
                "auditor3": $("#closing-manager").attr("data-val"),// 结算经理
                "auditor4": foundSettings.loginUser.uid,//foundSettings.loginUser.uid,//未用，暂时保留
                "annualBenefitRate": $("#annual_benefit_rate").val(), // 年华收益率 多个年化收益率，与起购金额一一对应。
                "beginForecastTime": new Date($("#begin_forecast_time").val()).getTime(), // 预告开始日期
                "lastForecastTime": new Date($("#last_forecast_time").val()).getTime(), // 预告结束日期
                "beginPayTime": new Date($("#begin_pay_time").val()).getTime(), // 打款开始日期
                "lastPayTime": new Date($("#last_pay_time").val()).getTime(), // 打款结束日期
                "beginWarmupTime": new Date($("#begin_warmup_time").val()).getTime(), // 预热开始日期
                "lastWarmupTime": new Date($("#last_warmup_time").val()).getTime(), // 预热结束日期
                "benefitType": $("#benefit_type").find("option:selected").val(), // 收益类型 1、固定收益 2、浮动收益
                "contract": $("#contract").val(), // 合同文件地址
                "createTime": new Date($("#create_time").val()).getTime(), // 产品创建日期
                "createUserId": foundSettings.loginUser.uid, // 创建产品用户ID
                "distributionTime": new Date($("#distribution_time").val()).getTime(), // 发行日期
                "entrustBank": $("#entrust_bank").val(), //"委贷行
                "feature": $("#feature").val(), // 产品亮点
                "financingParty": $("#financing_party").val(), // 资金使用方
                "fundType": $("#fund_type").find("option:selected").val(), // 基金类别  1、股票型 2、债券型 3、期货基金 4、量化对冲 5、FOF 6、定向增发 7、打新基金 8、PE基金 9、指数基金
                "investType": $("#invest_type").find("option:selected").val(), // 投向 1、房地产 2、征信 3、工商企业 4、PE/VC 5、新三板 6、打新 7、定增 8、二级市场－》股票型 9、其他
                "investmentAdviser": $("#investment_adviser").val(), // 投资顾问
                "investmentDeadline": $("#investment_deadline").val(), // 投资期限 单位月
                "investmentDeadlineRemark": $("#investment_deadline_remark").val(), //"投资期限备注
                "investmentManager": $("#investment_manager").val(), // 投资管理人
                "isPromote": $("#is_promote").find("option:selected").val(), //"是否宣传产品
                //"isVerify": "", // 是否审核通过
                "productDistribution": $("#product_distribution").val(), // 产品发行方
                "productName": $("#name").val(), // 产品名称
                "productPicture": productImgUrl == "" ? $("#upload_btn").attr("src") : productImgUrl, // 产品图片
                "productType": $("#product_type").find("option:selected").val(), // 产品类型 1、信托 2、资管 3、私募 4、所有
                "raiseAccount": $("#raise_account").val(), // 募集账号
                "raiseAccountName": $("#raise_account_name").val(), // 募集账户名称
                "raiseBank": $("#raise_bank").val(), // 募集行
                "raiseTotal": $("#raise_total").val(), // 募集规模 单位万元
                "raiseTotalRemark": $("#raise_total_remark").val(), // , 募集规模备注
                "rebateRatio": $("#rebate_ratio").val(), //"返佣比例
                "repaymentSource": $("#repayment_source").val(), // 还款来源
                "shortName": $("#short_name").val(), // 简称,
                "tranchePoint": $("#tranche_point").val(), // 起购金额"“200,300,400"//多个起购金额
                "trustMeasure": $("#trust_measure").val(), // 增信措施
                "trusteeBank": $("#trustee_bank").val(), // 托管行
                //"file": $("#contract").val(), // 产品介绍文件地址
                //"introduce": "", // 产品简介
                "distributionType": $("#distribution_type").find("option:selected").val(), // 发行方式 1、上游打包价 2、 发行费
                "interestPayType": $("#interest_pay_type").find("option:selected").val(), // 付息方式
                "packagePrice": $("#package_price").val(), //"上游打包价
                "closure": $("#closure").val(), // 封闭期，单位月
                "duration": $("#duration").val(), // 存续期，单位月
                "durationTotal": $("#duration_total").val(), // 存续规模，单位万元
                "netFund": $("#net_fund").val(), // 基金净值
                "purchaseRedemption": $("#purchase_redemption").val(), // 申购赎回
                /*"commissionPoint": "", // 佣金起点
                 "commissionRatio": "", // 佣金比率
                 "holdTotal": "", // 合计
                 "isCustomerUpload": "", //
                 "largeAmount": "", //
                 "lastSecondKillTime": "", // ,
                 "openDate": "", // ,
                 "theRaiseTotal": "", // ,
                 "warningLimit": ""   //*/
            };

            !isNaN(productJson.beginForecastTime) ? productJson.beginForecastTime : productJson.beginForecastTime = "";
            !isNaN(productJson.lastForecastTime) ? productJson.lastForecastTime : productJson.lastForecastTime = "";
            !isNaN(productJson.beginPayTime) ? productJson.beginPayTime : productJson.beginPayTime = "";
            !isNaN(productJson.lastPayTime) ? productJson.lastPayTime : productJson.lastPayTime = "";
            !isNaN(productJson.beginWarmupTime) ? productJson.beginWarmupTime : productJson.beginWarmupTime = "";
            !isNaN(productJson.lastWarmupTime) ? productJson.lastWarmupTime : productJson.lastWarmupTime = "";
            !isNaN(productJson.distributionTime) ? productJson.distributionTime : productJson.distributionTime = "";
            !isNaN(productJson.createTime) ? productJson.createTime : productJson.createTime = "";

            var isEdit = $(this).attr("isEdit");
            if (!isEdit) {
                invokeServer.createPro(productJson, function (data) {
                    if (data.status == "0") {
                        $("#menu_content").html("<div class='ajax_data_error'>创建产品成功!</div>");
                        $(".ajax_data_error").css("margin", "100px auto 300px");
                        $(".ajax_data_error").css("margin-top", "100px");
                        $(".ajax_data_error").css("font-size", "20px");
                    } else {
                        alert(data.message);
                    }
                }, function (error) {
                    alert(error.message);
                });
            }
        });


    };
    ////上传图片
    //var uploadImg = function () {
    //    // 上传图片
    //    $("#product_picture").change(function () {
    //        var objUrl = getObjectURL(this.files[0]);
    //        console.log("objUrl = " + objUrl);
    //        if (objUrl) {
    //            $("#upload_btn").attr("src", objUrl);
    //        }
    //    });
    //    //建立一个可存取到该file的url
    //    function getObjectURL(file) {
    //        var url = null;
    //        if (window.createObjectURL != undefined) { // basic
    //            url = window.createObjectURL(file);
    //        } else if (window.URL != undefined) {
    //            // mozilla(firefox)
    //            url = window.URL.createObjectURL(file);
    //        } else if (window.webkitURL != undefined) { // webkit or chrome
    //            url = window.webkitURL.createObjectURL(file);
    //        }
    //        return url;
    //    }
    //
    //    //产品图片上传
    //    var interval;  //定义一个定时器
    //    var srcValue = $("#upload_btn").attr("src");//拿到默认的图片路径
    //    interval = setInterval(function () {
    //        if ($("#upload_btn").attr("src") != srcValue) {
    //            //关闭
    //            $(".content").hide();
    //            $(".fudong_bg").hide();
    //            clearTimeout(interval);//关闭定时器
    //
    //        }//if 结束
    //    }, 1); //监听器结束
    //    $("#product_picture").click(function () {
    //        //拿到当前的图片路径
    //        var srcValue01 = $("#upload_btn").attr("src");
    //        //监听图片路径。发生改变时关闭弹出层
    //        interval2 = setInterval(function () {
    //            if ($("#upload_btn").attr("src") != srcValue01) {
    //                //关闭
    //                $(".content").hide();
    //                $(".fudong_bg").hide();
    //                clearTimeout(interval2);//关闭定时器
    //
    //            }//if 结束
    //        }, 1); //监听器结束
    //    });
    //
    //    $(".upload_btn").click(function () {
    //        $.ajax({
    //            cache: true,
    //            type: "post",
    //            url: null,
    //            data: $("#upload_form").serialize(),
    //            async: false,
    //            error: function (request) {
    //            },
    //            success: function (data) {
    //            }
    //        })
    //    });
    //};
    //页面的上一步下一步
    var pageStep = function () {
        //加载验证插件 并注册需要验证的输入框
        require("formValidation");
        var validate = $("#createPro input").simpleValidate();

        require("scrollablePath/scrollable");
        $(".createProduct").scrollable({
            onSeek: function (event, i) {
                $(".wizard-steps li").removeClass("active").eq(i).addClass("active").prevAll().addClass("active");
            },
            onBeforeSeek: function (event, i) {
                if (!isLastStep) {
                    var isValidate = false;
                    var stepId = "#createPro-step" + i;
                    //具体验证
                    isValidate = validate.formValidate($(stepId).find("input"));
                    return isValidate;
                }
                isLastStep = false;
            }
        });
    }
    //加载日历控件
    var loadDatePike = function () {
        //#begin_pay_time,#last_pay_time,#distribution_time,#create_time,#begin_forecast_time,#last_forecast_time,#begin_warmup_time,#last_warmup_time
        $(".p_selectdate").datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'Y/m/d',
            minDate: '-1981/12/30', // yesterday is minimum date
            maxDate: '+1970/12/30' // and tommorow is maximum date calendar
        });
    }
    //判断收益类型
    var earnings = function () {
        //判断收益类型
        $("#menu_content").on("change", "#benefit_type", function () {
            var selected = $("#benefit_type").find("option:selected").val();
            if (selected == "1") {
                $("#fixed").show();
                $("#float").hide();
            } else {
                $("#float").show();
                $("#fixed").hide();
            }
        });
    }
    //如果点击的按钮是上一步
    var isPrev = function () {
        $(".createProduct").on("click", ".prev-btn", function () {
            isLastStep = true;
        });
    }

    var init = function () {
        var jsonObj = {addOrEdit: 0}
        require.async(["doT", "./tpl/createProduct.html", "./css/createProduct.css"], function (doT, conTem, conCss, popup) {
            require("datepickerPath/jquery.datetimepicker.min");
            require("datepickerPath/jquery.datetimepicker.css");
            var html = doT.template(conTem)(jsonObj);
            $("#menu_content").html(html).fadeIn(500);

            //获取所有角色
            role.GetAllRole(function (data) {
                $(data.info.roles).each(function (index, item) {
                    switch (item.name) {
                        //case "产品经理" :
                        //    productManager = item.id;
                        //    //绑定自动完成控件
                        //    bindAutoComplete($("#product-manager"), productManager);
                        //    break;
                        case "渠道经理" :
                            ditchManager = item.id;
                            bindAutoComplete($("#ditch-manager"), ditchManager);
                            break;
                        case "审核经理" :
                            auditManager = item.id;
                            bindAutoComplete($("#audit-manager"), auditManager);
                            break;
                        case "结算经理" :
                            closingManager = item.id;
                            bindAutoComplete($("#closing-manager"), closingManager);
                            break;
                    }
                    ;
                });
                $("#product-manager").text(foundSettings.loginUser.name);
            });
            loadDatePike();

            pageStep();

            earnings();

            submitApply();

            FileUpLoad();

            isPrev();
        })

    };
    var bindAutoComplete = function ($inputObj, rid) {
        role.SearchUser(rid, function (resultData) {
            if ($.isArray(resultData.info.users)) {
                var dataA = [];
                $.each(resultData.info.users, function (i, item) {
                    var info = {userName: item.name, userId: item.id};
                    dataA.push(info);
                });
                $inputObj.autoComplete({
                    data: dataA,
                    request: {
                        url: "",
                        type: "",
                        data: ""
                    },
                    textField: "userName",
                    valueField: "userId",
                    callback: function (retval, items, $this) {
                    }
                });
            }
        }, function (error) {

        });
    }
    var FileUpLoad = function () {
        require("../../../js/lib/plupload/plupload.full.min.js");
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'UpLoadFiles', // you can pass an id...
            container: document.getElementById('container'), // ... or DOM Element itself
            url: '/api/oss.ashx?folder=product',
            flash_swf_url: 'js/lib/plupload/Moxie.swf',
            filters: {
                max_file_size: '100mb',
                mime_types: [
                    {title: "Image files", extensions: "jpg,gif,png"},
                    {title: "Zip files", extensions: "zip"}
                ]
            },

            init: {
                PostInit: function () {
                },

                FilesAdded: function (up, files) {
                    if (files.length == 1) {
                        plupload.each(files, function (file) {
                            document.getElementById('container').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                            uploader.start();
                        });
                    } else {
                        alert("只能选择一张图片!");
                        return false;
                    }
                    ;
                },

                UploadProgress: function (up, file) {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    if (file.percent == 100)  $("#UpLoadFiles").text("上传成功!");
                    return false;
                },

                FileUploaded: function (uploader, file, responseObject) {
                    productImgUrl = JSON.parse(responseObject.response).files[0].url;
                    $("#upload_btn").attr("src", productImgUrl);
                },

                Error: function (up, err) {
                    //document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
                }
            }
        });

        uploader.init();
    }
    exports.init = init;
    exports.productImgUpload = FileUpLoad;
});

