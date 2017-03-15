;
(function ($) {

    var SimpleTreeView = function (opts) {
        var defauts = {
                data: null,
                $target: $("body"),
                itemsFiled:"items",
                imgField:"img",
                imgHoverField:"imgHover",
                select: null,
                template: "<span class='menu-data' action='{action}'>{name}</span>"
            };

        this.settings = $.extend(defauts, opts);
        //初始化
        this.init();
    };

    $.extend(SimpleTreeView.prototype, {

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
                var $itemsBoby = $this.siblings("ul");
                var isHasItems = $itemsBoby.length <= 0;
                var isUp = $itemsBoby.css("display") == "none";

                //down up
                //取消其他锁定的样式
                $this.closest("ul").find("ul").not($itemsBoby).slideUp();
                $target.find(".rootItemSelect").removeClass("cfyUpBG rootItemSelect").addClass("cfyDownBG").find(".treeIcon").attr("src", function () {
                    return $(this).attr("data-img");
                });

                //下拉当前items
                $itemsBoby.slideToggle("fast");

                //改变li中的向上向下图标
                if(!isHasItems) {
                    var treeImg = $this.find(".treeIcon");
                    if (isUp) {
                        $this.removeClass("cfyDownBG").addClass("cfyUpBG rootItemSelect");
                        treeImg.attr("src",treeImg.attr("data-hover"));
                    } else {
                        $this.removeClass("cfyUpBG rootItemSelect").addClass("cfyDownBG");
                        treeImg.attr("src",treeImg.attr("data-img"));
                    }
                }

                //如果是子元素，则锁定样式
                if (isHasItems) {
                    $target.find(".itemSelected").removeClass("itemSelected");
                    $this.toggleClass("itemSelected");
                    //回调
                    if ($.isFunction(settings.select)) {
                        settings.select($this);
                    }
                }
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

    //build TreeView HTML Code
    var buildTreeViewHtml = function (data, tpl, itemsFiled, imgField, imgHoverField, isRoot) {

        var retval = "", items = data[itemsFiled];
        if (!isEmpty(items) && $.isArray(items)) {
            var rootClass = isRoot ? "cfyTreeView" : "";
            retval += "<ul class='{0}'>".format(rootClass);
            $.each(items, function (i, item) {

                var dataItemHtml = tplBindData(tpl, item);
                var itemsHtml = buildTreeViewHtml(item, tpl, itemsFiled, imgField,imgHoverField);

                var childItems = item[itemsFiled];
                var downUpClass = '';
                if (!isEmpty(childItems) && $.isArray(childItems)) {
                    downUpClass = "cfyDownBG";
                }

                var imgUrl = item[imgField];
                var img = '';
                if (!isEmpty(imgUrl)) {
                    var hoverUrl = isEmpty(item[imgHoverField])?imgUrl:item[imgHoverField];
                    img = "<img class='treeIcon' src='{0}' data-img='{0}' data-hover='{1}'  />".format(imgUrl,hoverUrl);
                }
                retval += " <li><span class='dataspan {0}'>{3}{1}</span>{2}</li>".format(downUpClass, dataItemHtml, itemsHtml, img);
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

    $.fn.extend({
        simpleTreeView: function (opts) {
            opts.$target = this;
            return new SimpleTreeView(opts);
        }
    });

})(jQuery);
