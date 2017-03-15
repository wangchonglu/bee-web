/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //调用远程服务器获取数据
    //var invokeServer = require("./business");

    var actions={
        showTree:function(treeData,$target,callback){
            var validate;
            var html='<div class="popDeptTree"></div>';
            require("simpleShowDialog");
            $(window).simpleShowDialog({
                title: "选择部门",
                content: html,
                width: 400,
                height: 500,
                actions: ["submit", "cancel"],
                onSubmit: function ($pop) {
                    //绑定部门信息到选择框
                    var $dept=$(".popDeptTree .itemSelected").find("span");
                    var name=$dept.text();
                    var id=$dept.attr("data-id");
                    if($.isFunction(callback)){
                        callback(name,id);
                        return true;
                    }
                    $target.val(name);
                    $target.attr("data-did",id);
                    return true;
                }
            });

            $(".popDeptTree").TreeView({
                data: treeData,
                template: "<span data-id='{id}' >{name}</span>",
                itemsFiled:"subs",
                select: function (target) {
                }
            });
        }
    };


    module.exports = actions;
});