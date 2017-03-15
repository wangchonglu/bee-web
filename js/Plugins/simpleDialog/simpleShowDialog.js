/**
 * Created by chonglu.wang on 2015/8/10.
 */
define(function (require, exports, module) {

    require('jquery');
    var doT = require('doT');
    require.async("./css/simpleDialog.css");

    var SimpleShowDialog = function (opts) {
        var defauts = {
            $target: undefined,
            title: "无标题",
            content: "",
            height: 500,
            width: 600,
            isShowAction: true,
            actions: undefined,
            onSubmit: undefined,
            onCancel: undefined
        };
        this.settings = $.extend(defauts, opts);
        //初始化
        this.init();
    };

    $.extend(SimpleShowDialog.prototype, {

        //初始化
        init: function () {
            var settings = this.settings;

            //初始化弹出层的内容
            var tpl = require("./tpl/dialog.html");
            settings.showAction = settings.isShowAction ? "block" : "none";
            settings.actions = settings.isShowAction ? settings.actions : [];
            var popuplayHtml = doT.template(tpl)(settings);
            var $popupla = $(popuplayHtml);
            $("body").append($popupla);

            //初始化弹出层位置和效果
            var $popBox = $popupla.find(".cfyPopuplay").hide();
            var $popBody = $popupla.find(".cfyPopuplay_body");
            var container = $(window);
            var targetY = (container.height() - settings.height) / 2;
            var targetX = (container.width() - settings.width) / 2;
            $popBox.css({width: settings.width, height: settings.height, left: targetX, top: 0 - settings.height});
            var bodyHeight = settings.isShowAction ? settings.height - 113 : settings.height - 113 + 45;
            $popBody.css("height", bodyHeight);
            $("body").css("overflow", "hidden");
            //下拉弹出层
            $popupla.find(".cfyPopuplay_shade").fadeIn();
            $popBox.show().animate({top: targetY}, 500);

            $popBody.perfectScrollbar();

            //设置z-index
            var root = 9998;
            var popCount = $(".cfyPopuplay_box").length;
            $popupla.find(".cfyPopuplay_shade").css("z-index", root + popCount);
            $popupla.find(".cfyPopuplay").css("z-index", root + popCount + 1);

            //事件初始化
            this.initEvent($popupla);
        },

        //初始化事件
        initEvent: function ($popupla) {
            var settings = this.settings;
            //cancel & close
            $popupla.find(".cfyPopuplay").on("click", ".cfyPopuplay_close,.cfyPopuplay_cancel,.cfyPopuplay_close1", function (event) {
                destroyBox($(this));
            });

            $popupla.find(".cfyPopuplay").on("click", ".cfyPopuplay_action :button:not('.cfyPopuplay_cancel')", function (event) {
                    popupayCallback($(this), settings.onSubmit);
                }
            );

            //拖拽移动
            require.async("jqueryDragmove", function () {
                $popupla.find(".cfyPopuplay_drag").dragmove($popupla.find(".cfyPopuplay"));
            });

        }
    });

    //毁掉函数
    var popupayCallback = function ($eventSource, callback) {
        if ($.isFunction(callback)) {
            var isDestroy = callback($eventSource.closest(".cfyPopuplay_body"));
            if (isDestroy == undefined || isDestroy) {
                destroyBox($eventSource);
            }
            ;
        }
    }

    var destroyBox = function ($eventSource) {
        var $box = $eventSource.closest(".cfyPopuplay_box");
        var $popBox = $box.find(".cfyPopuplay");
        var height = $popBox.height();
        $popBox.animate({top: 0 - height}, 500, function () {
            $(this).remove();
            $box.find(".cfyPopuplay_shade").fadeOut("slow", function () {
                $(this).remove();
                $box.remove();

                if ($(".cfyPopuplay_box").length <= 0) {
                    $("body").css("overflow", "inherit");
                }
            });
        });

    };

    (function ($) {
        //是否绑定?
        if (!$.fn.simpleShowDialog) {
            //全局函数
            $.fn.simpleShowDialog = function (opts) {
                opts.$target = this;
                new SimpleShowDialog(opts);
            };
        }
        ;
    })(jQuery);


});