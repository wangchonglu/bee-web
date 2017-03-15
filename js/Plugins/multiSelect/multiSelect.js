/**
 * Created by Moment on 2015/9/2.
 */

(function ($) {
    var MultiSelect = function (opts) {
        var _this = this,
            defaults = {
                data: {
                    head:[],
                    body:[],
                    primaryKey:{},
                },
                request: {
                    url: undefined,
                    type: undefined,
                    data: undefined
                },
                $Container: $("body")
            };
        this.settings = $.extend(defaults, opts);
        //初始化
        this.init();
    };

    $.extend(MultiSelect.prototype, {
        //初始化自动完成控件
        init: function () {
            var settings = this.settings;
            if(settings.data.body.length>0){
                var htmlTemp =buildHtml(settings);
                settings.$Container.html("").append(htmlTemp);
                //事件初始化
                this.initEvent(settings.$Container);
            }else{
                getSearchData(settings.textField, "", settings.request, function (data) {
                    var htmlTemp =buildHtml(settings);
                    settings.$Container.html("").append(htmlTemp);
                    //事件初始化
                    this.initEvent(settings.$Container);
                });
            }
        },
        //初始化事件
        initEvent: function ($Container) {
            var settings = this.settings,
                $contain = settings.$Container;
            $Container.on("click",".btnConfirm",function(event){
                var $outer=$(this).parent().parent().parent();
                $outer.find("input[type='checkbox']").each(function(i,n){

                });
            });

            $Container.on("focus",".searchInput",function(event){
                $(this).keydown(function(event){
                    if(event.keyCode==13){
                        //这里调用搜索接口
                        alert("Do Search");
                    }
                });
            });

            $Container.on("click",".searchIcon",function(event){
                //这里调用搜索接口
                alert("Do Search");
            });

        }
    });

    function buildHtml(setting){
        //表头
        var thead=setting.data.head;
        //数据
        var tbody=setting.data.body;

        var temp='<div class="multi-select">';
        var trHTemp='<div class="tableZone"><table><tr><th class="op">操作</th>';
        var trBTemp='<tr><td><input type="checkbox" name="group" /></td>';
        var searchTemp='<div class="searchZone"><div class="searchContent"><select class="searchFeild">';
        $.each(thead,function(index,item){
            var thTemp='<th class="field">'+item.text+'</th>';
            var tdTemp='<td data-field="'+item.value+'">{'+index+'}</td>';
            if(item.search==true){
                searchTemp+='<option value="'+item.value+'">'+item.text+'</option>';
            }
            trHTemp+=thTemp;
            trBTemp+=tdTemp;
        });
        trHTemp+='</tr>';
        trBTemp+='</tr>';
        searchTemp+='</select><input class="searchInput" type="text" placeholder="Search here ..." /><img class="searchIcon" src="../../../modules/foundation/image/operation_search.png" title="搜索" /></div></div>';
        temp+=searchTemp;
        temp+=trHTemp;
        $.each(tbody, function (index, item) {
            temp+=trBTemp.superformat(item,thead);
        });
        temp+='</table></div><div class="operateZone"><input type="button" class="commonInput btnConfirm" value="确认" /></div></div>';
        if($(temp).find("option").length==0){
            $(temp).find("select").remove();
        }
        return temp;
    }


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
    String.prototype.format = function () {
        var s = this,
            i = arguments.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    /*
     字符串格式化
     */
    String.prototype.superformat = function () {
        var s = this,
            values=arguments[0],
            head=arguments[1];

        $.each(head,function(i,n){
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), values[head[i].value]);
        });
        return s;
    };

    $.fn.extend({
        multiSelect: function (opts) {
            opts.$Container = this;
            return new MultiSelect(opts);
        }
    });
})(jQuery);
