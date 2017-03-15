/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    var cache={ };

    var event={
        admin:function(){
            $(".lead-assigned").on("click",".everyTeam",function(){
                var tid=$(this).attr("data-id");
                var teamMember=require("./teamMember");
                teamMember.toPage(1,10,tid,true,$("#allocatedLeads"));
            });
        }
    };

    var buildHtml=function(data,$target){
        require("./css/assigned.css");
        var temp =require("./tpl/assigned.html");
        var html=doT.template(temp)(data);
        $target.html(html);
        event.admin();
    };

    //用户操作
    var assigned={
        toPage:function(info,$target){
            cache=info;
            if(info.isAdmin==true){
                //管理员角色
                buildHtml(info.teamPoolList,$target);
                //修改title
                $(".allotCount").text(info.allCount);
            }else{
                //团队长角色
                //根据团队id获取团队具体信息
                var teamMember=require("./teamMember");
                teamMember.toPage(1,10,info.currentTeamPool.id,false,$("#allocatedLeads"));
            }
        }
    };

    module.exports = assigned;
});