/**
 * Created by chonglu.wang on 2015/8/14.
 */
define(function (require, exports, module) {
    (function ($) {
        //是否绑定
        if (!$.fn.initValidationEngine) {
            //全局函数
            $.fn.initValidationEngine = function () {
                var $targetForm = this;
                require.async([
                    "./css/template.css",
                    "./css/validationEngine.jquery.css",
                    "./js/languages/jquery.validationEngine-zh_CN.js",
                    "./js/jquery.validationEngine.js"],function(){
                    //初始化表单验证
                    $targetForm.validationEngine();
                });
            };
        }
        ;
    })(jQuery);
});