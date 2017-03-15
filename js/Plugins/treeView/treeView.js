define(function (require, exports, module) {

    require("./css/treeView.css");
    var treeView = function (opts) {
        var defauts = {
            data: null,
            $target: $("body"),
            itemsFiled: "items",
            imgField: "img",
            imgHoverField: "imgHover",
            select: null,
            template: "<span class='menu-data' action='{action}'>{name}</span>"
        };

        this.settings = $.extend(defauts, opts);
        //初始化
        this.init();
    };

    $.extend(treeView.prototype, {

        //初始化
        init: function () {
            var settings = this.settings;
            //build html
            var html = buildTreeViewHtml(settings.data,
                settings.template,
                settings.itemsFiled,
                settings.imgField,
                settings.imgHoverField,
                true);
            //append to target div
            settings.$target.append(html);
            //事件初始化
            this.initEvent();
        },

        //初始化事件
        initEvent: function () {

            var settings = this.settings;
            var $target = settings.$target;

            //treeView item down&up&select
            $target.on("click", ".dataspan", function (event) {
                var $this = $(this);
                OnDownUp($target,$this);
                //回调
                if ($.isFunction(settings.select)) {
                    settings.select($this);
                }
                event.stopPropagation();
            });

            $target.on("click", ".duCss", function (event) {
                var $this = $(this).parent();
                OnDownUp($target,$this);
                event.stopPropagation();
            });

            //hover
            $target.on({
                mouseover: function () {
                    $(this).addClass("itemHovered");
                },
                mouseout: function () {
                    $(this).removeClass("itemHovered");
                }
            }, ".dataspan");

        }

    });

    var OnDownUp = function ($target,$this) {
        var $itemsBoby = $this.siblings("ul");
        var isHasItems = $itemsBoby.length <= 0;
        //down up
        $this.closest("ul").find("ul").not($itemsBoby).slideUp();
        //下拉当前items
        $itemsBoby.slideToggle("fast");

        $target.find(".itemSelected").removeClass("itemSelected");
        $this.toggleClass("itemSelected");
        //没有子元素，则锁定样式
        if (!isHasItems) {
            var $currIcon = $this.find(".folderCss").toggleClass("closeFolder").toggleClass("openFolder");
            $this.closest("ul").find(".folderCss").not($currIcon).removeClass("openFolder").addClass("closeFolder");

            var $currDuIcon = $this.find(".duCss").toggleClass("closeDu").toggleClass("openDu");
            $this.closest("ul").find(".hasItems .duCss").not($currDuIcon).removeClass("openDu").addClass("closeDu");
        }
    };

    //build TreeView HTML Code
    var buildTreeViewHtml = function (data, tpl, itemsFiled, imgField, imgHoverField, isRoot) {

        var retval = "", items = data[itemsFiled];
        if (!isEmpty(items) && $.isArray(items)) {
            var rootClass = isRoot ? "mfyTreeView" : "";
            retval += "<ul class='{0}'>".format(rootClass);
            $.each(items, function (i, item) {

                var dataItemHtml = tplBindData(tpl, item);
                var itemsHtml = buildTreeViewHtml(item, tpl, itemsFiled, imgField, imgHoverField);
                var folderCss = "closeFolder";
                var duCss = "closeDu";
                var isHasItems = "hasItems";
                if (isEmpty(item[itemsFiled])) {
                    duCss = "";
                    isHasItems = "noItems";
                }
                retval += " <li><span class='dataspan {4}'><i class='duCss {3}'></i><i class='folderCss {2}'></i>{0}</span>{1}</li>".format(dataItemHtml, itemsHtml, folderCss, duCss,isHasItems);
            });
            retval += "</ul>";
        }
        return retval;
    };

    //data & tpl binding
    var tplBindData = function (tpl, d) {
        var datas = $.makeArray(d);
        var retval = [];
        $.each(datas, function (i, data) {
            var html = tpl.replace(/{[\s\S]+?}/g, function (match, code) {
                var attr = match.substring(1, match.length - 1);
                return data[attr];
            });
            retval.push(html);
        });
        return retval.join('');
    }

    /*
     String format
     */
    String.prototype.format = String.prototype.f = function () {

        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    //is not null
    var isEmpty = function (d) {
        var retval = false;
        if (d == undefined || d == null || d == '') {
            retval = true;
        }
        ;
        return retval;
    };

    ;
    (function ($) {
        $.fn.extend({
            TreeView: function (opts) {
                opts.$target = this;
                return new treeView(opts);
            }
        });
    })(jQuery);
});