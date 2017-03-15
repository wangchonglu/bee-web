/**
 * Created by Moment on 2015/8/11.
 */
define(function (require, exports, module) {
    //加载csv插件
    require("jqueryCsv");

    var encodeHTML=function(source) {
        return source
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/, '"')
            .replace(/'/, "'");
    };

    var actions={
        importLeads:function(target,callback,errorcall){
            if (window.FileReader && window.Blob) {
                //var fileInput = document.getElementById('fileInput');
                //var fileDisplayArea = document.getElementById('fileDisplayArea');
                var file = target.files[0];
                var textType = /excel.*/;
                if (file.type == "application/vnd.ms-excel") {
                    var reader = new FileReader();
                    reader.readAsText(file, "GBK");
                    reader.onload = function (e) {
                        var ret = $.simple_csv(reader.result);

                        callback(ret);
                    };
                } else {
                    errorcall("请选择csv文件");
                }
            } else {
                alert("您的浏览器不支持FileReader，请使用最新版本的Chrome或Firefox浏览器");
            }
        }
    };

    module.exports=actions;
});