/**
 * Created by Moment on 2015/8/6.
 */

define(function (require, exports, module) {
    require.async("./css/autoComplete.css");
    (function ($) {
        /*
         data:默认数据，
         textField：字段名称
         valueField：字段值
         request：请求体
         callback：回调函数
         */
        var AutoComplete = function (opts) {
            var _this = this,
                defauts = {
                    data: undefined,
                    textField: "name",
                    valueField: "value",
                    searchField: ["name"],
                    request: {
                        url: undefined,
                        type: undefined,
                        data: undefined
                    },
                    callback: undefined,
                    $target: $("body")
                };
            this.settings = $.extend(defauts, opts);
            //初始化
            this.init();
        };

        $.extend(AutoComplete.prototype, {
            //初始化自动完成控件
            init: function () {
                var settings = this.settings;
                //事件初始化
                this.initEvent(settings.$target);
            },
            //初始化事件
            initEvent: function ($inputs) {
                var settings = this.settings,
                    $thisTarget = settings.$target,
                    dataArray = settings.data,
                    req = settings.request;
                settings.$target.addClass("commonInput");

                var timer;

                $inputs.on({
                    //输入框改变事件
                    "input propertychange": function (event) {
                        buildData($(this));
                        event.stopPropagation();
                    },
                    "click": function (event) {
                        buildData($(this));
                        event.stopPropagation();
                    }
                });

                function buildData($this) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var keyWord = $this.val(); console.log(keyWord);
                        dataArray = settings.data;
                        if (isNullOrEmpty(dataArray) && !isNullOrEmpty(settings.request.url)) {
                            getSearchData(settings.textField, keyWord, req, function (data) {
                                dataArray = data;
                            });
                        }
                        if (dataArray.length > 0) {
                            var html = '<div class="auto_search_data_content"><ul class="auto_search_data_items">';
                            $.each(dataArray, function (index, item) {

                                var isMatch = true;
                                if(!isNullOrEmpty(settings.searchField)){
                                    if(item[settings.searchField]!=undefined &&　item[settings.searchField].indexOf(keyWord)<0){
                                        isMatch = false;
                                    }
                                }
                                if(isMatch) {
                                    html = html + '<li class="auto_search_data_item" data-val=' + item[settings.valueField] + '>' + item[settings.textField] + '</li>';
                                }
                            });
                            html = html + '</ul></div>';

                            $("body").find(".auto_search_data_content").remove();

                            var inputW = $this.width() + 17;
                            var x = $this.offset().left - 3;
                            var y = $this.offset().top + $this.height() + 10;
                            var bodyCss = {width: inputW, position: "absolute", top: y, left: x};
                            var itemsBody = $(html).show().css(bodyCss);
                            $("body").append(itemsBody);
                            initAllEvent($this);
                        }
                        else {
                            $("body").find(".auto_search_data_content").remove();
                        }

                    },100);

                }

                //输入框有焦点事件
                $inputs.on({
                    keydown: function (event) {
                        //38:up   40:down   13:Enter
                        var $focused = $(".auto_search_data_content").find(".focused");
                        if (event.keyCode == 40) {
                            if ($focused.length > 0) {
                                $focused.next(".auto_search_data_item").addClass("focused").siblings().removeClass("focused");
                            }
                            else {
                                $(".auto_search_data_content").find(".auto_search_data_item").first().addClass("focused").siblings().removeClass("focused");
                            }
                        }
                        else if (event.keyCode == 38) {
                            if ($focused.length > 0) {
                                $focused.prev(".auto_search_data_item").addClass("focused").siblings().removeClass("focused");
                            }
                        }
                        else if (event.keyCode == 13) {
                            if ($focused.length > 0) {
                                $(".auto_search_data_content").remove();
                                buildCurrentItem($focused, dataArray, $(this));
                            }
                        }
                        event.stopPropagation();
                    }
                });

                //给Body添加点击事件，去除输入框的失去焦点事件，防止多事件(输入框的失去焦点事件/弹出层的点击事件)冲突
                $(document).click(function (event) {
                   $(".auto_search_data_content").remove();
                   event.stopPropagation();
                });

                //绑定数据
                var buildCurrentItem = function (self, items, $thisTar) {
                    if ($.isFunction(settings.callback)) {
                        var retval = {
                            title: self.text(),
                            value: self.data("val")
                        };
                        $thisTar.attr("data-val", retval.value).val(retval.title);
                        settings.callback(retval, items, $thisTar,settings);
                    }
                    clearTimeout(timer);
                };

                var initAllEvent = function ($this) {
                    //鼠标经过/点击/失去焦点 事件
                    $(".auto_search_data_content").on({
                        mouseover: function () {
                            $(this).siblings().removeClass("focused");
                            $(this).addClass("focused");
                        },
                        mouseout: function () {
                            $(this).removeClass("focused").siblings().removeClass("focused");
                        },
                        click: function (event) {
                            buildCurrentItem($(this), dataArray, $this);
                            $(".auto_search_data_content").remove();
                            event.stopPropagation();
                        }
                    }, ".auto_search_data_item");
                };

            }
        });


        /*
         异步请求搜索数据
         */
        function getSearchData(field, keyWord, request, callback) {
            //参数为空 直接返回
            if (isNullOrEmpty(request.url) || isNullOrEmpty(request.type) || isNullOrEmpty(request.data)) {
                return;
            }
            var url = request.url;
            var jsonObj = {field: keyWord};
            if (request.type.toUpperCase() == 'GET') {
                url = url + "?" + field + "=" + keyWord;
                jsonObj = '';
            }
            $.ajax({
                type: request.type,
                contentType: 'application/json',
                url: request.url,
                data: jsonObj,
                dataType: 'json',
                success: function (data) {
                    if (!isNullOrEmpty(callback) && typeof (callback) == "function") {
                        callback(data);
                    }
                },
                error: function (error) {
                }
            });
        };

        /*
         判断是否为空
         */
        function isNullOrEmpty(obj) {
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        };

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
            autoComplete: function (opts) {
                opts.$target = this;
                return new AutoComplete(opts);
            }
        });
    })(jQuery);
});
