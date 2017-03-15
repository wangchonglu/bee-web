/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //加载验证插件 并注册需要验证的输入框
    //require.async("formValidation");

    //调用远程服务器获取数据
    //var invokeServer = require("./business");

    //用户操作
    var teamActions={
        renderPage:function(index,dispCount,$target,$title){
            var data=[
                {id:"0001",userName:"张三",departName:"销售部",phone:"15123437678",personalEmail:"zhang@sina.com"},
                {id:"0001",userName:"张四",departName:"营销部",phone:"13123437678",personalEmail:"zhang@sina.com"},
                {id:"0001",userName:"张五",departName:"营销部",phone:"15223437678",personalEmail:"zhang@sina.com"},
                {id:"0001",userName:"张六",departName:"销售部",phone:"15323437678",personalEmail:"zhang@sina.com"},
                {id:"0001",userName:"李三",departName:"人事部",phone:"15423437678",personalEmail:"zhang@sina.com"},
                {id:"0001",userName:"李四",departName:"国际金融部",phone:"15523437678",personalEmail:"zhang@sina.com"}
            ];

            var temp =require("./tpl/resignUser.html");
            var html=doT.template(temp)(data);
            $target.html(html);

            var title="离职员工"+"("+"共"+data.length+"人)";
            $title.text(title);

            $target.find(".resign-user-pager").customPager({
                curPage: 1,
                allCount: 1,
                bindData: function (curPageIndex, displayCount, maxCount) {
                    teamActions.renderTable(curPageIndex, displayCount);
                }
            });
        },
        renderTable:function(curPageIndex, displayCount,$target){


        }
    };

    module.exports = teamActions;
});