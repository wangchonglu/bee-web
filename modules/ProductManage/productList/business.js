define(function (require, exports, module) {
    var foundSettings = require("../foundation/settings");

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    };

    function ajaxRequest(url, type, reqData, callback, errorcall) {
        $.support.cors = true;
        $.ajax({
            type: type,
            url: url,
            dataType: 'json',
            data: reqData,
            success: function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            },
            error: function (XMLHttpRequest, aa, bb) {
                if ($.isFunction(errorcall)) {
                    errorcall(XMLHttpRequest);
                }
            }
        });
    };

    var actions = {
        //创建新产品
        createPro: function (proJson, callback, errorcall) {
            proJson = JSON.stringify(proJson);
            proJson = JSON.stringify(proJson);
            var url = foundSettings.api.createProducts;
            var reqData = {
                token: foundSettings.loginUser.token,
                productJson: proJson
            };
            ajaxRequest(url, "POST", reqData, callback, errorcall);
        },
        //获取产品列表
        getProductList: function (reqData, callback, errorcall) {
            var url = foundSettings.api.getProductList;
            ajaxRequest(url, "GET", reqData, callback, errorcall)
        },
        //根据产品编号查询产品信息
        getProductInfo: function (reqData, callback, errorcall) {
            var url = foundSettings.api.getProductInfo;
            ajaxRequest(url, "GET", reqData, callback, errorcall)
        },
        //根据产品编号删除产品
        deleteProductById: function (reqData, callback, errorcall) {
            var url = foundSettings.api.deleteProductById;
            ajaxRequest(url, "GET", reqData, callback, errorcall)
        },
        //根据产品编号修改产品
        editProductById: function (proJson, callback, errorcall) {
            proJson = JSON.stringify(proJson);
            proJson = JSON.stringify(proJson);
            var reqData = {token: foundSettings.loginUser.token, productJson: proJson};
            var url = foundSettings.api.editProductById;
            ajaxRequest(url, "POST", reqData, callback, errorcall)
        },
        //查询发行方案
        getProductScheme: function (productNumber, callback, errorcall) {
            var reqData = {
                token: foundSettings.loginUser.token,
                id: productNumber,
                uid: foundSettings.loginUser.uid,
                tid: foundSettings.loginUser.tid
            };
            var url = foundSettings.api.getProductScheme;
            ajaxRequest(url, "GET", reqData, callback, errorcall)
        },
        //修改发行方案
        editProductScheme: function (schemeJson, callback, errorcall) {
            schemeJson = JSON.stringify(schemeJson);
            schemeJson = JSON.stringify(schemeJson);
            var reqData = {
                token: foundSettings.loginUser.token,
                productJson: schemeJson,
                uid: foundSettings.loginUser.uid,
                tid: foundSettings.loginUser.tid
            };
            var url = foundSettings.api.editProductScheme;
            ajaxRequest(url, "POST", reqData, callback, errorcall)
        },
        //根据产品编号查询产品信息
        getUserDetail: function (reqData, callback, errorcall) {
            var url = foundSettings.api.getUserDetail;
            ajaxRequest(url, "GET", reqData, callback, errorcall)
        },
    };
    module.exports = actions;
});