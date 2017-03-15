/**
 * Created by Moment on 2015/9/2.
 */

define(function (require, exports, module) {
    require.async("./css/index.css");

    //获取全局配置文件
    //var globalSetting;
    //require.async("globalSetting",function(setting){
    //    globalSetting=setting;
    //});

    (function ($) {
        var SimpleSearch = function (opts) {
            var _this = this,
                defaults = {
                    searchField:[],
                    callback:undefined,
                    $Container: $("body")
                };
            this.settings = $.extend(defaults, opts);
            //初始化
            this.init();
        };

        $.extend(SimpleSearch.prototype, {
            //初始化自动完成控件
            init: function () {
                var settings = this.settings;
                if($.isArray(settings.searchField) && settings.searchField.length>0 ){
                    var htmlTemp =buildHtml(settings.searchField);
                    settings.$Container.html("").append(htmlTemp);
                    var flag=true;
                    if(settings.$Container.find(".selectSearch").length==0){
                        settings.$Container.find(".txtSearch").css({
                            "left":"10px",
                            "width":"170px"
                        });
                        flag=false;
                    }
                    //事件初始化
                    this.initEvent(settings,flag);
                }
            },
            //初始化事件
            initEvent: function (settings,flag) {
                var $container=settings.$Container;

                $container.find(".txtSearch").off("keydown").on("keydown",function(event){
                    if(event.keyCode==13){
                        if($.isFunction(settings.callback)){
                            var keyword=$container.find(".txtSearch").val();
                            if(flag==true){
                                var value=$container.find(".selectSearch").val();
                                settings.callback(value,keyword);
                            }else{
                                settings.callback(settings.searchField[0].value,keyword);
                            }

                        }
                    }
                });

                $container.find(".imgSearch").off("click").on("click",function(event){
                    if($.isFunction(settings.callback)){
                        var keyword=$container.find(".txtSearch").val();
                        if(flag==true){
                            var value=$container.find(".selectSearch").val();
                            settings.callback(value,keyword);
                        }else{
                            settings.callback(settings.searchField[0].value,keyword);
                        }
                    }
                });

                $container.on("change",".selectSearch",function(event){
                    $container.find(".txtSearch").prop("placeholder","搜索"+$(this).find("option:selected").text());
                });

            }
        });

        function buildHtml(searchField){
            var temp='<div class="simpleSearch">';
            var selectTemp='<select class="selectSearch">';
            var placeHolder="搜索"+searchField[0].text;
            if(searchField.length>1){
                var optionTemp='<option value="{0}">{1}</option>';
                $.each(searchField,function(index,item){
                    selectTemp+=optionTemp.format(item.value,item.text);
                });
                selectTemp+='</select>';
            }else{
                selectTemp="";
            }
            temp+=selectTemp;
            temp+='<input class="txtSearch" type="text" placeholder="{0}" autocomplete="off"/><img class="imgSearch" src="./modules/foundation/image/operation_search.png" title="搜索"/></div>'.format(placeHolder);
            return temp;
        }

        /*
         字符串格式化
         */
        String.prototype.format = function () {
            var s = this,
                i = arguments.length;
            while (i--) {
                s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
            }
            return s;
        };


        $.fn.extend({
            simpleSearch: function (opts) {
                opts.$Container = this;
                return new SimpleSearch(opts);
            }
        });
    })(jQuery);
});
