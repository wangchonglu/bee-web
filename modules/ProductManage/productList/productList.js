/**
 * Created by Moment on 2015/7/30.
 * 上传文件 0.2
 */
define(function (require, exports, module) {
    var doT = require("doT");
    var invokeServer = require("./business");
    var foundSettings = require("../foundation/settings");
    require.async("./css/productList.css");

    //上传的文件名字和链接
    var productDetailName = "";
    var productDetailUrl = "";


    //保存当前操作的产品所对应的所有文件
    var fileList = $();

    //新增或保存产品
    var AddOrEdit = function () {

        //提交
        $(".createProduct").on("click", ".commits", function () {
            require("datepickerPath/jquery.datetimepicker.min");
            var productJson = {
                "auditor1": $("#ditch-manager").attr("data-val"), //渠道经理
                "auditor2": $("#audit-manager").attr("data-val"), // 审核经理
                "auditor3": $("#closing-manager").attr("data-val"),// 结算经理
                "auditor4": foundSettings.loginUser.uid,//未用，暂时保留
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
                "productPicture": $("#upload_btn").attr("src"), // 产品图片
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

            if ($(this).attr("isEdit")) {
                productJson.id = $("#id").val();
                invokeServer.editProductById(productJson, function (data) {
                    if (data.status == "0") {
                        alert("操作成功!");
                        init();
                    } else {
                        alert(data.message);
                    }
                }, function (error) {
                    alert(error.message);
                });
            } else {
                invokeServer.createPro(productJson, function (data) {
                    if (data.status == "0") {
                        alert("操作成功!");
                    } else {
                        alert(data.message);
                    }
                }, function (error) {
                    alert(error.message);
                });
            }
        });

    }
    //排序
    var DataOrderby = function (currentPage, pageSize) {
        require.async(["doT", "./tpl/pagerTemp.html"], function (doT, htmlTpl) {
            //根据产品分类获取产品列表 参数构建
            var reqData = {
                token: foundSettings.loginUser.token,
                page: currentPage,
                size: pageSize,
                productType: 0,
                sortdatafield: $(".select_op_sort").val(),
                sortorder: $(".select_op_sort option:selected").attr("sort")
            };
            var items = [];
            var pageNo;
            //根据产品分类获取产品列表
            invokeServer.getProductList(reqData, function (data) {
                if (data.status && data.status == 0) {
                    pageNo = data.info.body.pageNo;
                    var productsArray = data.info.body.products;
                    if (productsArray.length > 0) {
                        $.each(productsArray, function (index, value) {
                            var item = {
                                id: value.id,
                                proName: value.productName,
                                fund: "基金",
                                income: "稳定收益",
                                region: value.raiseTotal,
                                years: value.investmentDeadline,
                                yearRate: value.annualBenefitRate,
                                backRate: value.rebateRatio
                            };
                            items.push(item);
                        })

                        var tableData = {
                            items: items
                        };
                        var html = doT.template(htmlTpl)(tableData);

                        $(".prolist_table tbody").html(html);
                        $(".prolist_pager").html("");
                        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
                            $(".prolist_pager").customPager({
                                curPage: 1,
                                allCount: data.info.body.pageCount,
                                bindData: function (curPageIndex, displayCount, maxCount) {
                                    bindData(curPageIndex, displayCount, 1);
                                }
                            });
                        });
                    }
                }
            }, function () {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                $(".ajax_data_error").css("margin", "100px auto 300px");
                $(".ajax_data_error").css("margin-top", "100px");
                $(".ajax_data_error").css("font-size", "20px");
            });


        });
    }
    //数据加载及绑定
    var LoadData = function (type) {
        require.async(["doT", "./tpl/index.html"], function (doT, htmlTpl) {
            //根据产品分类获取产品列表 参数构建
            var reqData = {
                token: foundSettings.loginUser.token,
                page: 1,
                size: 10,
                productType: 0,
                sortdatafield: "rebateRatio",
                sortorder: "asc",
                productName: $(".op_pro_search_btn").val()
            };
            var items = [];
            var pageNo;
            //根据产品分类获取产品列表
            invokeServer.getProductList(reqData, function (data) {
                if (data.status && data.status == 0) {
                    pageNo = data.info.body.pageNo;
                    var productsArray = data.info.body.products;
                    if (productsArray.length > 0) {
                        $.each(productsArray, function (index, value) {
                            var item = {
                                id: value.id,
                                proName: value.productName,
                                fund: "基金",
                                income: "稳定收益",
                                region: value.raiseTotal,
                                years: value.investmentDeadline,
                                yearRate: value.annualBenefitRate ? JSON.parse(value.annualBenefitRate) : "",
                                backRate: value.rebateRatio
                            };
                            items.push(item);
                        })

                        var tableData = {
                            items: items
                        };
                        var html = "";
                        if (!type) {
                            html = doT.template(htmlTpl)(tableData);
                            $("#menu_content").html(html);
                        } else {
                            html = require("./tpl/pagerTemp.html");
                            html = doT.template(html)(tableData);
                            $(".prolist_table tbody").html(html);
                        }


                        productEvent();

                        $(".prolist_pager").html("");
                        require.async(["PagerPath/customPager", "PagerPath/css/customPager.css"], function (customPager, pagerCss) {
                            $(".prolist_pager").customPager({
                                curPage: 1,
                                allCount: data.info.body.pageCount,
                                bindData: function (curPageIndex, displayCount, maxCount) {
                                    bindData(curPageIndex, displayCount, 1);
                                }
                            });
                        });
                    } else {
                        html = doT.template(htmlTpl)({items: undefined});
                        $("#menu_content").html(html);
                    }
                }
            }, function () {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                $(".ajax_data_error").css("margin", "100px auto 300px");
                $(".ajax_data_error").css("margin-top", "100px");
                $(".ajax_data_error").css("font-size", "20px");
            });


        });
    }
    var bindData = function (curPageIndex, displayCount, type) {
        var reqData = {
            token: foundSettings.loginUser.token,
            page: curPageIndex,
            size: displayCount,
            productType: 0,
            sortdatafield: "rebateRatio",
            sortorder: "asc"
        };
        var items = [];
        invokeServer.getProductList(reqData, function (data) {
            if (data.status && data.status == 0) {
                pageNo = data.info.body.pageNo;
                var productsArray = data.info.body.products;
                if (productsArray.length > 0) {
                    $.each(productsArray, function (index, value) {
                        var item = {
                            id: value.id,
                            proName: value.productName,
                            fund: "基金",
                            income: "稳定收益",
                            region: value.raiseTotal,
                            years: value.investmentDeadline,
                            yearRate: (JSON.parse(value.annualBenefitRate))[0].annual,
                            backRate: value.rebateRatio
                        };
                        items.push(item);
                    })
                    var tableData = {
                        items: items
                    };
                    var html = require("./tpl/pagerTemp.html");
                    html = doT.template(html)(tableData);
                    $(".prolist_table").find("tbody").fadeOut(500, function () {
                        $(this).html(html).fadeIn(500);
                    });
                }
            }
        }, function () {
            //处理加载数据出错
            $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            $(".ajax_data_error").css("margin", "100px auto 300px");
            $(".ajax_data_error").css("margin-top", "100px");
            $(".ajax_data_error").css("font-size", "20px");
        });
    }
    //获取发行方案
    var getScheme = function (productNumber, callback) {
        invokeServer.getProductScheme(productNumber, function (data) {
            callback(data);
        });
    }
    //获取详细信息
    var getDetail = function (productNumber, callback) {
        var reqData = {token: foundSettings.loginUser.token, id: productNumber};
        invokeServer.getProductInfo(reqData, function (data) {
            callback(data);
        });
    }
    //触发元素的点击事件
    var returnClick = function (target) {
        return $("#" + target + "").click();
    }
    //根据用户编号获取用户信息
    var getUserDetail = function (uid, callback) {
        var userData = {uid: uid};
        invokeServer.getUserDetail(userData, function (userInfo) {
            callback(userInfo);
        })
    }
    //上传文件
    var FileUpLoad = function () {
        require("../../../js/lib/plupload/plupload.full.min.js");
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'productDetailFileUpload', // you can pass an id...
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
                FilesAdded: function (up, files) {
                    if (files.length > 1) {
                        alert("每次只可以选择一个文件!");
                        return false;
                    }
                    if (fileList.files != undefined) {
                        var isExist = false;
                        if (fileList.files.length > 0) {
                            $.grep(fileList.files, function (item, index) {
                                if (item.fileName == files[0].name) {
                                    isExist = true;
                                }
                            });
                        }
                        if (isExist) {
                            alert("选择的文件已存在!");
                            return false;
                        }
                    }
                    plupload.each(files, function (file) {
                        $("#noFileData").remove();
                        var temp = $("#fileListTemp").html();
                        temp = temp.format(file.name, file.name);
                        $(".fileStyle").append(temp);
                        uploader.start();
                    });
                },

                UploadProgress: function (up, file) {
                    //document.getElementById(file.name).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    var fileObj = $(".fileStyle a[href='" + file.name + "']").parent();
                    fileObj.find("b").html("<span>" + file.percent + "%</span>");
                    return false;
                },

                FileUploaded: function (uploader, file, responseObject) {
                    // $("#noFileData").remove();
                    productDetailName = JSON.parse(responseObject.response).files[0].name;
                    productDetailUrl = JSON.parse(responseObject.response).files[0].url;
                    if (fileList.files != undefined) {
                        fileList.files.push({
                            fileName: productDetailName,
                            fileUrl: productDetailUrl
                        });
                    } else {
                        fileList.files = [];
                        fileList.files.push({
                            fileName: productDetailName,
                            fileUrl: productDetailUrl
                        });
                    }

                    var fileObj = $(".fileStyle a[href='" + file.name + "']").parent();
                    fileObj.find("a").attr("href", productDetailUrl);
                    fileObj.find("img").attr("file-id", productDetailName);
                    //var temp = $("#fileListTemp").html();
                    //temp = temp.format(productDetailUrl, productDetailName);
                    //$(".fileStyle").append(temp);
                },
            }
        });

        uploader.init();
    }
    //查看详情
    var ProductDetail = function (currentObj) {
        //构造查询单个产品所需参数
        var productNumber = $(currentObj).attr("data-id");
        //var productNumber = $(this).attr("data-id");
        var reqData = {token: foundSettings.loginUser.token, id: productNumber};
        require.async(["doT", "./css/popDetails.css", "popupLayer"], function (doT, conTem, conCss, popup) {
            var html = require("./tpl/popDetails.html");
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

    //产品列表的事件
    var productEvent = function () {
        //创建产品
        $(".product_list").on("click", ".operation_add", function () {
            /**
             require("./css/createProduct.css");
             require("datepickerPath/jquery.datetimepicker.min");
             require("datepickerPath/jquery.datetimepicker.css");
             var htm=require("./tpl/createProduct.html");
             $("#menu_content").html(htm).fadeIn(500);
             */
            var jsonObj = {};
            require.async(["doT", "./tpl/createProduct.html", "./css/createProduct.css"], function (doT, conTem, conCss, popup) {
                require("datepickerPath/jquery.datetimepicker.min");
                require("datepickerPath/jquery.datetimepicker.css");
                var html = doT.template(conTem)(jsonObj);
                $("#menu_content").html(html).fadeIn(500);
                //加载验证插件 并注册需要验证的输入框
                require("formValidation");
                var validate = $("#createPro input").simpleValidate();
                $(".p_selectdate").datetimepicker({
                    lang: 'ch',
                    timepicker: false,
                    format: 'Y-m-d',
                    formatDate: 'Y/m/d',
                    minDate: '-1981/12/30', // yesterday is minimum date
                    maxDate: '+1970/12/30' // and tommorow is maximum date calendar
                });

                require("scrollablePath/scrollable");
                $(".createProduct").scrollable({
                    onSeek: function (event, i) {
                        $(".wizard-steps li").removeClass("active").eq(i).addClass("active").prevAll().addClass("active");
                    },
                    onBeforeSeek: function (event, i) {
                        var isValidate = false;
                        var stepId = "#createPro-step" + i;
                        //具体验证
                        isValidate = validate.formValidate($(stepId).find("input"));
                        return isValidate;
                    }
                })
            })

            AddOrEdit();

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
            })

        })
        //回车键搜索事件
        $(".product_list").on("focus", ".op_pro_search_btn", function () {
            $(this).keydown(function (event) {
                if (event.keyCode == 13) {
                    //这里调用搜索接口
                    LoadData("search");
                }
            });
        });
        //点击搜索事件
        $(".product_list").on("click", ".op_pro_search_img", function () {
            //这里调用搜索接口
            LoadData("search");
        });
        //排序事件
        $(".product_list").on("change", ".select_op_sort", function () {
            DataOrderby(1, 10);
        });
        //编辑产品事件
        $(".product_list").on("click", ".list_img_edit", function () {
                var $tr = $(this).parent().parent();
                var productNumber = $(this).attr("data-id");

                //构造查询单个产品所需参数
                var reqData = {token: foundSettings.loginUser.token, id: productNumber};
                //获取产品信息并绑定
                invokeServer.getProductInfo(reqData
                    , function (resultData) {
                        require.async(["doT", "../newProduct/tpl/newProduct.html", "../newProduct/css/newProduct.css", "../newProduct/newProduct"], function (doT, conTem, conCss, addPro, popup) {
                            //编辑页面初始化
                            addPro.init();

                            require("datepickerPath/jquery.datetimepicker.min");
                            require("datepickerPath/jquery.datetimepicker.css");

                            resultData.info.body.product.readonly = "readonly";
                            resultData.info.body.product.showPNoCSS = "border:0px;";
                            var scheme = resultData.info.body.product.scheme;
                            scheme.lastSecondKillTime = scheme.lastSecondKillTime == '' ? '' : new Date(scheme.lastSecondKillTime).toLocaleDateString();
                            scheme.openDate = scheme.openDate == '' ? '' : new Date(scheme.openDate).toLocaleDateString();

                            //年化收益率
                            if (resultData.info.body.product.base.annualBenefitRate) {
                                var annualObj = JSON.parse(resultData.info.body.product.base.annualBenefitRate);
                                resultData.info.body.product.base.annualBenefitRate = annualObj;
                            }

                            //佣金费用
                            if (resultData.info.body.product.scheme.commissionRatio) {
                                var rebateRatioObj = JSON.parse(resultData.info.body.product.scheme.commissionRatio);
                                resultData.info.body.product.scheme.commissionRatio = rebateRatioObj;
                            }

                            //发行计划文件
                            if (resultData.info.body.product.scheme.schemeFile) {
                                var schemeFile = JSON.parse(resultData.info.body.product.scheme.schemeFile);
                                resultData.info.body.product.scheme.schemeFile = schemeFile;
                            }


                            var html = doT.template(conTem)(resultData.info.body.product);
                            $("#menu_content").html(html);

                            //编辑页面初始化
                            addPro.loadStep();
                            addPro.averageChange();
                            addPro.archiveOperation();
                            addPro.FileUpLoad(true, 'float-productPicture', 'new-float-productPicture-container', "img-float-Preview");
                            addPro.FileUpLoad(true, 'fixed-productPicture', 'new-fixed-productPicture-container', "img-fixed-Preview");
                            addPro.FileUpLoad(false, 'new-schemeFile', 'new-scheme-container', "new-schemeFile-preview");
                            if (resultData.info.body.product.base.benefitType == 2) {
                                $("#new-product-step2-fixed").css("display", "none");
                                $("#new-product-step3-fixed").css("display", "none");
                                $("#new-product-step2-float").css("display", "block");
                                $("#new-product-step3-float").css("display", "block");
                            }
                            //如果是编辑则一直显示完成按钮
                            $(".mfy-steps-ok").css("display", "inline-block");

                            //addPro.productImgUpload();
                            $(".commits").attr("isEdit", "true");
                            //给文本框注册日历事件
                            //#begin_pay_time,#last_pay_time,#distribution_time,#create_time,#begin_forecast_time,#last_forecast_time,#begin_warmup_time,#last_warmup_time
                            $(".p_selectdate").datetimepicker({
                                lang: 'ch',
                                timepicker: false,
                                format: 'Y-m-d',
                                formatDate: 'Y/m/d',
                                minDate: '-1981/12/30', // yesterday is minimum date
                                maxDate: '+1970/12/30' // and tommorow is maximum date calendar
                            });

                            //根据查询出来的经理编号获取经理姓名
                            getUserDetail(resultData.info.body.product.auditors.auditor1, function (userInfo) {
                                if (userInfo.list != undefined) {
                                    $("#new-auditor1").val(userInfo.list.name);
                                }
                                ;
                            });
                            getUserDetail(resultData.info.body.product.auditors.auditor2, function (userInfo) {
                                if (userInfo.list != undefined) {
                                    $("#new-auditor2").val(userInfo.list.name);
                                }
                                ;
                            });
                            getUserDetail(resultData.info.body.product.auditors.auditor3, function (userInfo) {
                                if (userInfo.list != undefined) {
                                    $("#new-auditor3").val(userInfo.list.name);
                                }
                                ;
                            });

                            //如果是浮动收益类型则显示不同字段
                            var selected = resultData.info.body.product.base.benefitType;
                            if (selected == "1") {
                                $("#fixed").show();
                                $("#float").hide();
                            } else {
                                $("#float").show();
                                $("#fixed").hide();
                            }

                        })

                    }
                    , function () {

                    });


            }
        )
        ;
        //详情
        $(".product_list").on("click", ".list_img_details", function () {
            //构造查询单个产品所需参数
            var productNumber = $(this).attr("data-id");
            var reqData = {token: foundSettings.loginUser.token, id: productNumber};
            require.async(["doT", "./css/popDetails.css", "popupLayer"], function (doT, conTem, conCss, popup) {
                var html = require("./tpl/popDetails.html");
                invokeServer.getProductInfo(reqData,
                    function (resultData) {
                        if (resultData.status == 0) {
                            //构造页面所需函数
                            var infoBase = resultData.info.body.product.base;
                            var infoFixed = resultData.info.body.product.fixed;
                            var infoAuditors = resultData.info.body.product.auditors;

                            for (var prop in infoBase) {
                                infoBase[prop] == undefined ? infoBase[prop] == "" : prop;
                            }
                            for (var prop in infoFixed) {
                                infoFixed[prop] == undefined ? infoFixed[prop] == "" : prop;
                            }
                            for (var prop in infoAuditors) {
                                infoAuditors[prop] == undefined ? infoAuditors[prop] == "" : prop;
                            }
                            var item = {
                                name: infoBase.productName,
                                productType: infoBase.productType,
                                benefitType: infoBase.benefitType,
                                raiseTotal: infoBase.raiseTotal,
                                investmentDeadline: infoBase.investmentDeadline,
                                annualBenefitRate: infoBase.annualBenefitRate,
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
                                auditor3: infoAuditors.auditor3

                            };
                            html = doT.template(html)(item);
                            //加载弹出层
                            require("simpleShowDialog");
                            $(window).simpleShowDialog({
                                title: "产品详情信息",
                                content: html,
                                width: 900,
                                height: 650,
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
        });
        //删除产品事件
        $(".product_list").on("click", ".list_img_delete", function () {
            if (confirm("确定删除吗？")) {
                var currentObj = $(this);
                var productNumber = currentObj.attr("data-id");
                var reqData = {token: foundSettings.loginUser.token, id: productNumber};
                invokeServer.deleteProductById(reqData,
                    function (resultData) {
                        if (resultData.status == 0) {
                            alert("删除成功!");
                            currentObj.parent().parent().hide(1000, function () {
                                currentObj.parent().parent().remove();
                            });
                        }
                    }
                    ,
                    function (error) {
                        //处理加载数据出错
                        $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                        $(".ajax_data_error").css("margin", "auto");
                        $(".ajax_data_error").css("margin-top", "100px");
                        $(".ajax_data_error").css("font-size", "20px");
                    }
                )
                ;
            }
        });
        //鼠标经过表格事件
        $(".product_list").on({
            mouseover: function () {
                $(this).removeClass("trEvenBackColor");
                $(this).removeClass("trOddBackColor");
                $(this).addClass("trMouseover");
            },
            mouseout: function () {
                $(this).removeClass("trMouseover");
                $(".prolist_table tr:even").addClass("trEvenBackColor");
                $(".prolist_table tr:odd").addClass("trOddBackColor");
            }
        }, ".prolist_table tbody>tr");
        // 鼠标点击行
        //$(".product_list").on({
        //    click: function () {
        //        ProductDetail(this);
        //    }
        //}, "tbody td").not(".prolist_tbody_op");

        $(".prolist_table td").not('.prolist_tbody_op').click(function () {
            ProductDetail($(this).parent());
        });

        //点击分配额度
        $(".product_list").on("click", ".list_img_distribute", function () {
            var distributeApi = require("distributeLimit");
            distributeApi.showDistributeBox({});
        });

    };
//产品详情 上传列表的事件
    var productDetailUpLoad = function () {
        //点击<a:上传>标签触发上传控件的事件
        //$(".editDetail").on("click", ".upLoad", function () {
        //    returnClick("product_upLoadFile");
        //});
        //上传文件
        //$(".editDetail").on("change", ".upLoadFile", function () {
        //    //console.log($(this));
        //    var fileUrl = $(this).val();
        //    var fileName = this.files[0].name;
        //    var isExist = false;
        //    if (fileList.files.length > 0) {
        //        $.grep(fileList.files, function (item, index) {
        //            if (item.fileUrl == fileUrl) {
        //                isExist = true;
        //            }
        //        });
        //    }
        //    if (!isExist) {
        //        fileList.files.push({"fileName": fileName, "fileUrl": fileUrl});
        //        $(".editDetail .fileStyle").append("" +
        //            "<div><a target='_blank' href='" + fileUrl + "'>" + fileName + "</a>" +
        //            "<img file-id='" + fileUrl + "' title='删除' class='deleteDetail' src='./modules/foundation/image/table_op_delete.png'>" +
        //            "</div>"
        //        )
        //        ;
        //    } else {
        //        alert("上传的文件已存在!");
        //        return;
        //    }
        //});
        //删除文件
        $(".editDetail").on("click", ".deleteDetail", function () {
            if (confirm("是否确认删除?")) {
                var fileUrl = $(this).attr("file-id");
                fileList.files = $.grep(fileList.files, function (item, index) {
                    return item.fileUrl != fileUrl;
                });
                $(this).parent().hide(500, function () {
                    $(this).remove();
                });
            }
        });
    }
//初始化，加载数据 这里需要调用接口
    var init = function () {
        //查询产品列表
        LoadData();


    };

    exports.init = init;
})
;
