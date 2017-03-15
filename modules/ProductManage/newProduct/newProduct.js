/**
 * Created by frey on 2015/9/14.
 */
define(function (require, exports, module) {

    var doT = require("doT");
    var invokeServer = require("../productList/business");
    var role = require("userRolePath/userRoleManage/business");
    var foundSettings = require("../foundation/settings");
    require("autoCompletePath/autoComplete");

    var validate;
    var productInfo;

    var loadStep = function (isSkipStep) {
        var autoStepControl = require("./newProductStep");

        //分步操作的上一步、下一步、完成、点击 事件
        autoStepControl({
            onPre: function (currentIndex) {
                if (isSkipStep == false) {
                    $(".mfy-steps-ok").css("display", "none");
                }
                $(".mfy-steps-next").css("display", "inline-block");
                return true;
            },
            onNext: function (currentIndex) {
                var stepId = "#new-product-step" + currentIndex;
                var averageType = $("input[name='new-benefitType']:checked").attr("value");
                if (currentIndex == 2) {
                    if (averageType == 1) {
                        stepId = "#new-product-step2-fixed";
                    }
                    if (averageType == 2) {
                        stepId = "#new-product-step2-float";
                    }
                    if (averageType == 3) {
                        stepId = "#new-product-step2-floatAndFixed";
                    }
                }
                if (currentIndex == 3) {
                    if (averageType == 1) {
                        stepId = "#new-product-step3-fixed";
                    }
                    if (averageType == 2) {
                        stepId = "#new-product-step3-float";
                    }
                    if (averageType == 3) {
                        stepId = "#new-product-step3-floatAndFixed";
                    }
                }

                //具体验证
                var isValidate = validate.formValidate($(stepId).find("input"));
                if (currentIndex == 4 && !isSkipStep && isValidate) {
                    $(".mfy-steps-next").css("display", "none");
                    $(".mfy-steps-ok").css("display", "inline-block");
                }
                return isValidate;
            },
            onSkipStep: function (currentIndex) {
                return true;
            }
            ,
            onOk: function () {
                if (isSkipStep == false) {
                    addProduct();
                } else {
                    var averageType = $("input[name='new-benefitType']:checked").attr("value");
                    var isValidate
                    if (averageType == 1) {
                        isValidate = validate.formValidate($("#new-product-step2-fixed").find("input"));
                        if (isValidate) {
                            isValidate = validate.formValidate($("#new-product-step3-fixed").find("input"));
                        }
                    }
                    if (averageType == 2) {
                        isValidate = validate.formValidate($("#new-product-step2-float").find("input"));
                        if (isValidate) {
                            isValidate = validate.formValidate($("#new-product-step3-float").find("input"));
                        }
                    }
                    if (isValidate) {
                        editProduct();
                    } else {
                        alert("收益类型改变, 请填写后续内容!");
                        return;
                    }
                }
            },
            isSkipStep: isSkipStep,
        });

        $(".mfy-steps-ok").css("display", "none");
    }

    var addProduct = function () {
        var productParams;
        productParams = acquireParams("");
        invokeServer.createPro(productParams, function (data) {
            if (data.status == "0") {
                $("#menu_content").html("<div class='ajax_data_error'>创建产品成功!</div>");
                $(".ajax_data_error").css("margin", "100px auto 30px");
                $(".ajax_data_error").css("margin-top", "100px");
                $(".ajax_data_error").css("font-size", "20px");
                $(".ajax_data_error").after('<div style="text-align:center;"><a class="distribute_amount" onclick="distributeAmount(' +
                    productParams +
                    ')" style="color: blue;text-decoration: underline; cursor: pointer;">分配团队销售额度</a></div>'
                )
                ;
            } else {
                alert(data.message);
            }
        });
    }

    var distributeAmount = function () {
        $("#menu_content").on("click",".distribute_amount",function () {
            var distributeApi = require("distributeLimit");
            distributeApi.showDistributeBox({productID:productInfo.id,productName:productInfo.productName,raiseTotal:productInfo.raiseTotal});
        });
    }

    var editProduct = function () {
        var productParams;
        productParams = acquireParams("");
        productParams.id = $("#productID").text();
        invokeServer.editProductById(productParams, function (data) {
            if (data.status == "0") {
                $("#menu_content").html("<div class='ajax_data_error'>编辑产品成功!</div>");
                $(".ajax_data_error").css("margin", "100px auto 30px");
                $(".ajax_data_error").css("margin-top", "100px");
                $(".ajax_data_error").css("font-size", "20px");
                $(".ajax_data_error").after('<div style="text-align:center;"><a class="distribute_amount" style="color: blue;text-decoration: underline; cursor: pointer;">分配团队销售额度</a></div>'
                )
                ;
            } else {
                alert(data.message);
            }
        }, function (error) {
            alert(error.message);
        });
    }

    var averageChange = function () {
        $("input[name='new-benefitType']").click(function () {
            if ($(this).attr("value") == 1) {
                $("#new-product-step2-fixed").css("display", "block");
                $("#new-product-step3-fixed").css("display", "block");
                $("#new-product-step2-float").css("display", "none");
                $("#new-product-step3-float").css("display", "none");
                $("#new-product-step2-floatAndFixed").css("display", "none");
                $("#new-product-step3-floatAndFixed").css("display", "none");
            }
            if ($(this).attr("value") == 2) {
                $("#new-product-step2-fixed").css("display", "none");
                $("#new-product-step3-fixed").css("display", "none");
                $("#new-product-step2-float").css("display", "block");
                $("#new-product-step3-float").css("display", "block");
                $("#new-product-step2-floatAndFixed").css("display", "none");
                $("#new-product-step3-floatAndFixed").css("display", "none");
            }
            if ($(this).attr("value") == 3) {
                $("#new-product-step2-fixed").css("display", "none");
                $("#new-product-step3-fixed").css("display", "none");
                $("#new-product-step2-float").css("display", "none");
                $("#new-product-step3-float").css("display", "none");
                $("#new-product-step2-floatAndFixed").css("display", "block");
                $("#new-product-step3-floatAndFixed").css("display", "block");
            }
        });
    }

    var acquireParams = function (productParams) {


        productParams = {
            "productName": $("#new-productName").val(),
            "shortName": $("#new-shortName").val(),
            "productType": $("#new-productType input[type='radio']:checked").attr("value"),
            "benefitType": $("#new-benefitType input[type='radio']:checked").attr("value"),
            "investType": $("#new-investType :selected").val(),
            "beginPayTime": new Date($("#new-beginPayTime").val()).getTime(),
            "lastPayTime": new Date($("#new-lastPayTime").val()).getTime(),
            "rebateRatio": $("#new-rebateRatio").val(),
            "schemeFile": $("#new-schemeFile").val(),
            "theRaiseTotal": $("#new-theRaiseTotal").val(),
            "warningLimit": $("#new-warningLimit").val(),
            "holdTotal": $("#new-holdTotal").val(),
            "largeAmount": $("#new-largeAmount").val(),
            "isCustomerUpload": $("input[name='isCustomerUpload']:checked").attr("value"),
            "commissionPoint": $("#new-commissionPoint").val(),
            "commissionRatio": $("#new-commissionRatio").val(),
            "auditor1": $("#new-auditor1").attr("data-val"),
            "auditor2": $("#new-auditor2").attr("data-val"),
            "auditor3": $("#new-auditor3").attr("data-val"),
            "auditor4": $("#new-auditor4").attr("data-val"),


        };

        var schemeFiles = [];
        $("#new-schemeFile-preview a").each(function (index, item) {
            schemeFiles.push({fileName: $(item).text(), fileUrl: $(item).attr("href")});
        });
        productParams.schemeFile = JSON.stringify(schemeFiles);

        var rebateList = [];
        //佣金费用需要以json的格式发送
        $(".new-product-rebateRatio-archive").each(function (index, item) {
            var $inputObj = $(item).find("input");
            var start = $inputObj.eq(0).val();
            var end = $inputObj.eq(1).val();
            var annual = $inputObj.eq(2).val();
            rebateList.push({start: start, end: end, annual: annual})
        });
        productParams.commissionRatio = JSON.stringify(rebateList);


        var averageType = $("input[name='new-benefitType']:checked").val();
        if (averageType == 1) {
            productParams.financingParty = $("#new-financingParty").val();
            productParams.investmentManager = $("#new-investmentManager").val();
            productParams.raiseTotal = $("#new-raiseTotal").val();
            productParams.investmentDeadline = $("#new-investmentDeadline").val();
            productParams.investmentDeadlineRemark = $("#new-investmentDeadlineRemark").val();
            productParams.trusteeBank = $("#new-trusteeBank").val();
            productParams.interestPayType = $("#new-interestPayType").val();
            productParams.repaymentSource = $("#new-repaymentSource").val();
            productParams.raiseBank = $("#new-raiseBank").val();
            productParams.raiseAccountName = $("#new-raiseAccountName").val();
            productParams.raiseAccount = $("#new-raiseAccount").val();
            productParams.tranchePoint = $("#new-tranchePoint").val();
            productParams.productPicture = $("#img-fixed-Preview").attr("src");
            productParams.trustMeasure = $("#new-trustMeasure").val();

            var annualList = [];
            //年华收益率需要以json的格式发送
            $(".new-product-archive").each(function (index, item) {
                var $inputObj = $(item).find("input");
                var start = $inputObj.eq(0).val();
                var end = $inputObj.eq(1).val();
                var annual = $inputObj.eq(2).val();
                annualList.push({start: start, end: end, annual: annual})
            });
            productParams.annualBenefitRate = JSON.stringify(annualList);

        } else {
            productParams.investmentManager = $("#new-float-investmentManager").val();
            productParams.raiseTotal = $("#new-float-raiseTotal").val();
            productParams.duration = $("#new-float-duration").val();
            productParams.investmentDeadlineRemark = $("#new-float-investmentDeadlineRemark").val();
            productParams.trusteeBank = $("#new-float-trusteeBank").val();
            productParams.raiseBank = $("#new-float-raiseBank").val();
            productParams.raiseAccountName = $("#new-float-raiseAccountName").val();
            productParams.raiseAccount = $("#new-float-raiseAccount").val();
            productParams.tranchePoint = $("#new-float-tranchePoint").val();
            productParams.closure = $("#new-closure").val();
            productParams.purchaseRedemption = $("#new-purchaseRedemption").val();
            productParams.productPicture = $("#img-float-Preview").attr("src");
            productParams.openDate = new Date($("#new-openDate").val()).getTime();
        }
        productInfo = productParams;
        return productParams;

    }

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

    var FileUpLoad = function (isImage, browse_button, container, previewImg) {

        var fileType = undefined;
        if (isImage) {
            fileType = [
                {title: "Image files", extensions: "jpg,gif,png"}
            ];
        } else {
            fileType = [
                {title: "Doc files", extensions: "pdf"}
            ];
        }

        require("../../../js/lib/plupload/plupload.full.min.js");
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,html4',
            browse_button: browse_button, // you can pass an id...
            container: document.getElementById(container), // ... or DOM Element itself
            url: '/api/oss.ashx?folder=product',
            flash_swf_url: 'js/lib/plupload/Moxie.swf',
            filters: {
                max_file_size: '100mb',
                mime_types: fileType,
                prevent_duplicates: true
            },
            init: {
                PostInit: function () {
                },

                FilesAdded: function (up, files) {
                    if (files.length == 1) {
                        plupload.each(files, function (file) {
                            if (isImage) {
                                document.getElementById(container).innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                            }
                            uploader.start();
                        });
                    } else {
                        if (isImage) {
                            alert("只能选择一张图片!");
                            return false;
                        }
                    }
                    ;
                },

                UploadProgress: function (up, file) {
                    if (isImage) {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    } else {

                    }
                    return false;
                },

                FileUploaded: function (uploader, file, responseObject) {

                    var productImgUrl = JSON.parse(responseObject.response).files[0].url;
                    var productImgName = JSON.parse(responseObject.response).files[0].name;

                    if (isImage) {
                        //上传图片
                        $("#" + previewImg + "").attr("src", productImgUrl);
                    } else {
                        //上传文件
                        var template = "<div><a href='" + productImgUrl + "'> " + productImgName + " </a></div>";
                        $("#new-schemeFile-preview").append(template);
                    }
                    FileUpLoad(isImage, browse_button, container, previewImg);
                },

                Error: function (up, err) {
                    //document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
                }
            }
        });

        //if (isImage) {
        //    uploader.settings.filters.mime_types = [
        //        {title: "Image files", extensions: "jpg,gif,png"}
        //    ]
        //}

        uploader.init();
    }

    var archiveOperation = function () {
        //年华收益率
        $(".new-product-annual-addTemp").click(function () {
            var $currentObj = $(this).parent();
            var $inputObj = $(this).parent().find("input");

            var random = Math.random() * 100;
            var groupId = $inputObj.attr("validate-group");
            var cloneGroupId = groupId + random;

            var start = $inputObj.eq(0).val();
            var end = $inputObj.eq(1).val();
            var annual = $inputObj.eq(2).val();
            if (start && end && annual) {
                //var temp = $currentObj.html();
                var $cloneObj = $currentObj.clone(true);
                $cloneObj.find("input").val("");
                $cloneObj.find("input").attr("validate-group", cloneGroupId);
                $currentObj.parent().append($cloneObj);
            } else {
                alert("请将当前行填写完成!");
                return;
            }
        });
        $(".new-product-annual-removeTemp").click(function () {
            if ($(".new-product-archive").length > 1) {
                $(this).parent().hide(function () {
                    $(this).remove();
                });
            } else {
                alert("请至少填写一行!");
                return;
            }
        });

        //佣金费用
        $(".new-product-rebateRatio-addTemp").click(function () {
            var $currentObj = $(this).parent();
            var $inputObj = $(this).parent().find("input");
            var start = $inputObj.eq(0).val();
            var end = $inputObj.eq(1).val();
            var annual = $inputObj.eq(2).val();
            if (start && end && annual) {
                //var temp = $currentObj.html();
                var $cloneObj = $currentObj.clone(true);
                $cloneObj.find("input").val("");
                $currentObj.parent().append($cloneObj);
            } else {
                alert("请将当前行填写完成!");
                return;
            }
        });
        $(".new-product-rebateRatio-removeTemp").click(function () {
            if ($(".new-product-rebateRatio-archive").length > 1) {
                $(this).parent().hide(function () {
                    $(this).remove();
                });
            } else {
                alert("请至少填写一行!");
                return;
            }
        });
    }

    var pageLayout = function () {
        //调整radio按钮与文字对齐
        $("input[type='radio']").parent().css("padding-top", "6px");

        //根据屏幕的高度改变新增产品时显示的高度
        var clientHeight = document.body.clientHeight;
        var contentHeight = clientHeight - 280;
        $(".steps-content").height(contentHeight);
        $(".steps-contentList").height(contentHeight);
    }

    var pageOperation = {
        //页面加载
        loadPage: function () {
            require.async(["./tpl/newProduct.html", "./css/newProduct.css"], function (tpl, tplCss) {
                var item = {};
                var html = doT.template(tpl)(item);
                $("#menu_content").html(html).fadeIn(500);

                averageChange();
                loadStep(false);
                archiveOperation();

                pageLayout();
                distributeAmount();

                //加载验证插件 并注册需要验证的输入框
                require("formValidation");
                validate = $(".new-product-container input").simpleValidate();

                //加载时间控件并绑定
                require("datepickerPath/jquery.datetimepicker.min");
                require("datepickerPath/jquery.datetimepicker.css");
                $(".p_selectdate").datetimepicker({
                    lang: 'ch',
                    timepicker: false,
                    format: 'Y-m-d',
                    formatDate: 'Y/m/d',
                    minDate: '-1981/12/30', // yesterday is minimum date
                    maxDate: '+1970/12/30' // and tommorow is maximum date calendar
                });

                //获取所有角色并绑定到第五步的自动完成
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
                                bindAutoComplete($("#new-auditor1"), ditchManager);
                                break;
                            case "审核经理" :
                                auditManager = item.id;
                                bindAutoComplete($("#new-auditor2"), auditManager);
                                break;
                            case "结算经理" :
                                closingManager = item.id;
                                bindAutoComplete($("#new-auditor3"), closingManager);
                                break;
                        }
                        ;
                    });
                    $("#new-auditor4").text(foundSettings.loginUser.name);
                });

                //上传图片, 由于浮动收益和固定收益都有上传于是传入控件的ID 参数1:上传文件的按钮, 参数2:上传文件的容器, 参数3:预览的控件
                FileUpLoad(true, 'float-productPicture', 'new-float-productPicture-container', "img-float-Preview");
                FileUpLoad(true, 'fixed-productPicture', 'new-fixed-productPicture-container', "img-fixed-Preview");
                //上传文件
                FileUpLoad(false, 'new-schemeFile', 'new-scheme-container', "new-schemeFile-preview");
                FileUpLoad(false, 'fixed-productDetail', 'new-fixed-productDetail-container', "new-productDetail-preview");
                FileUpLoad(false, 'float-productDetail', 'new-float-productDetail-container', "new-float-productDetail-preview");
                FileUpLoad(false, 'floatAndFixed-productDetail', 'new-floatAndFixed-productDetail-container', "new-floatAndFixed-productDetail-preview");

            });
        },
    }

    var init = function () {
        //页面加载
        pageOperation.loadPage();
    }


    exports.init = init;
    exports.loadStep = loadStep;
    exports.averageChange = averageChange;
    exports.FileUpLoad = FileUpLoad;
    exports.archiveOperation = archiveOperation;
});