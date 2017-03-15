/**
 * Created by Moment on 2015/8/3.
 * 自定义分页控件
 * curPage:当前页索引
 * allCount:数据总页数
 * $target：绑定分页控件对象
 * bindData：绑定数据方法
 */
define(function (require, exports, module) {
    require.async("./css/customPager.css");
    (function ($) {
    var CustomPager = function (opts) {
        var _this = this,
            defauts = {
                curPage:0,
                allCount:0,
                $target: $("body"),
                bindData:null
            };
        this.settings = $.extend(defauts, opts);
        //初始化
        this.init();
    };

    $.extend(CustomPager.prototype, {
        //初始化分页控件
        init: function () {
            var settings = this.settings;
            var pagerHtmlTemp='<div class="pager_content"><img class="pager_first" src="./modules/foundation/image/pager_first.png" title="第一页" /><img class="pager_pre" src="./modules/foundation/image/pager_pre.png" title="上一页"/><div class="pager_info"><span class="pager_info_border">|</span>第<input type="text" class="pager_info_page" value="{0}" />页&nbsp;&nbsp;&nbsp;共<span class="pager_info_count">{1}</span>页<span class="pager_info_border">|</span></div><img class="pager_next" src="./modules/foundation/image/pager_next.png" title="下一页" /><img class="pager_last" src="./modules/foundation/image/pager_last.png" title="最后一页"/><select class="pager_select"><option>10</option><option>20</option><option>30</option><option>40</option></select></div>';
            pagerHtmlTemp=pagerHtmlTemp.format(settings.curPage,settings.allCount);
            //添加
            settings.$target.append(pagerHtmlTemp);
            //事件初始化
            this.initEvent(settings.$target);
        },
        //初始化事件
        initEvent: function ($div) {
            var settings = this.settings, $container = settings.$target;

            //跳转第一页点击事件
            $div.on("click", ".pager_first", function (event) {
                var $this = $(this);
                 $this.parent().find(".pager_info_page").val("1");
                //页显示数目
                var displayCount=$this.parent().find(".pager_select").val();
                //当前页索引
                var curPageIndex = $this.parent().find(".pager_info_page").val();
                var maxCount=settings.allCount;
                //模拟分页数据
                settings.bindData(1,displayCount, maxCount);
                event.stopPropagation();
            });
            //上一页点击事件
            $div.on("click", ".pager_pre", function (event) {
                var $this = $(this);
                //页显示数目
                var displayCount=$this.parent().find(".pager_select").val();
                //当前页索引
                var curPageIndex = $this.parent().find(".pager_info_page").val();
                if(curPageIndex> 1)
                {
                    $this.attr("disabled","false");
                    curPageIndex--;
                    $this.parent().find(".pager_info_page").val(curPageIndex);
                    var maxCount=settings.allCount;
                    //模拟分页数据
                    settings.bindData(curPageIndex,displayCount, maxCount);
                }
                else
                {
                    $this.attr("disabled","true");
                }
                event.stopPropagation();
            });
            //下一页点击事件
            $div.on("click", ".pager_next", function (event) {
                var $this = $(this);
                //页显示数目
                var displayCount=$this.parent().find(".pager_select").val();
                var maxCount=settings.allCount;
                //当前页索引
                var curPageIndex = $this.parent().find(".pager_info_page").val();
                if(curPageIndex < maxCount)
                {
                    $this.attr("disabled","false");
                    curPageIndex++;
                    $this.parent().find(".pager_info_page").val(curPageIndex);
                    //模拟分页数据
                    settings.bindData(curPageIndex,displayCount, maxCount);
                }
                else{
                    $this.attr("disabled","true");
                }
                event.stopPropagation();
            });
            //最后一页点击事件
            $div.on("click", ".pager_last", function (event) {
                var $this = $(this);
                //页显示数目
                var displayCount=$this.parent().find(".pager_select").val();
                //当前页索引
                var curPageIndex = $this.parent().find(".pager_info_page").val();
                var maxCount=settings.allCount;
                $this.parent().find(".pager_info_page").val(maxCount);
                //模拟分页数据
                settings.bindData(maxCount,displayCount, maxCount);
                event.stopPropagation();
            });
            //页显示数目更改事件
            $div.on("change", ".pager_select", function (event) {
                var $this = $(this);
                var displayCount=$this.val();
                //当前页索引
                var curPageIndex = $this.parent().find(".pager_info_page").val();
                var maxCount=settings.allCount;
                //模拟分页数据
                settings.bindData(curPageIndex,displayCount, maxCount);
                event.stopPropagation();
            });
        }
    });

    /*
     字符串格式化
     */
    String.prototype.format = String.prototype.f = function () {
        var s = this,
            i = arguments.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    $.fn.extend({
        customPager: function (opts) {
            opts.$target = this;
            return new CustomPager(opts);
        }
    });
})(jQuery);
});