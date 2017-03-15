/**
 * Created by hello on 2015/8/17.
 */

define(function (require, exports, module) {
    //获取全局配置文件
    var globalSetting = require("globalSetting");

    //默认配置
    var userApi = {
        /*------------------------产品管理-------------------------------*/
        //创建产品
        createProducts: globalSetting.api.baseServer + "product/create",
        //产品库
        getProductList: globalSetting.api.baseServer + "product/get-category-product-list",
        //获取产品信息
        getProductInfo: globalSetting.api.baseServer + "product/get-info",
        //删除单个产品
        deleteProductById: globalSetting.api.baseServer + "product/delete",
        //修改单个产品
        editProductById: globalSetting.api.baseServer + "product/update",
        //获取发行方案
        getProductScheme: globalSetting.api.baseServer + "product/get-scheme",
        //创建发行方案
        createProductScheme: globalSetting.api.baseServer + "product/create-scheme",
        //修改发行方案
        editProductScheme: globalSetting.api.baseServer + "product/update-scheme",
        //获取用户详情
        getUserDetail : globalSetting.api.baseServer + "user/get-user-detail"
    };
    //merger request url
    var newApi = $.extend(userApi, globalSetting.api);
    globalSetting.api = newApi;

    //exports new config
    module.exports = globalSetting;

});