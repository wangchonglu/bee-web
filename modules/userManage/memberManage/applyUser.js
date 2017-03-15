/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //用户操作
    var userActions={
        renderPage:function(index,dispCount,$target,$title){
            invokeServer.GetApplyUser(index,dispCount,function(data){
                var temp =require("./tpl/applyUser.html");
                var html=doT.template(temp)(data.allUsers);
                $target.html(html);

                var title="待认证员工"+"("+"共"+data.total+"人)";
                $title.text(title);

                $target.find(".applyuser-pager").customPager({
                    curPage: 1,
                    allCount: data.allPages,
                    bindData: function (curPageIndex, displayCount, maxCount) {
                        userActions.renderTable(curPageIndex, displayCount);
                    }
                });

            },function(error){

            });
        },
        renderTable:function(curPageIndex, displayCount,$target){
            invokeServer.GetApplyUser(curPageIndex,curPageIndex,function(data){
                var temp =require("./tpl/applyUser.html");
                var html=doT.template(temp)(data.allUsers);
                var data=$(html).find("tbody").html();
                $target.html(data);

            },function(error){

            });

        }
    };

    module.exports = userActions;
});