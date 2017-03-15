/**
 * Created by Moment on 2015/9/10.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //加载公共文件
    require("JsHelper");

    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");

    var cache={
        rootDept:{}
    };

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    var event={
        common:function(){
            /*全选/单选事件*/
            $(".member-manage").find(".check-item").off("click").on("click", function (event) {
                if($(this).attr("data-check")=="false"){
                    $(this).attr("data-check","true");
                    $(this).css("background-position","-24px 1px");
                }else{
                    $(this).attr("data-check","false");
                    $(this).css("background-position","1px 1px");
                }

                var flag=false;
                $(".check-item").each(function(index,item){
                    if($(item).attr("data-check")=="true"){
                        flag=true;
                        return;
                    }
                });

                if(flag==true){
                    $(".delete-team").css("color","#666");
                    $(".delete-team").attr("disable","false");
                    $(".delete-team").addClass("hoverDel");
                }else{
                    $(".delete-team").css("color","#b1b1b1");
                    $(".delete-team").attr("disable","true");
                    $(".delete-team").removeClass("hoverDel");
                }

                event.stopPropagation();
            });

            /*全选/单选事件*/
            $(".member-manage").find(".check-all").off("click").on("click",function (event) {
                if($(this).attr("data-check")=="false"){
                    $(this).attr("data-check","true");
                    $(this).css("background-position","-24px 1px");
                    $(".check-item").attr("data-check","true");
                    $(".check-item").css("background-position","-24px 1px");

                    $(".delete-team").css("color","#666");
                    $(".delete-team").attr("disable","false");
                    $(".delete-team").addClass("hoverDel");
                }else{
                    $(this).attr("data-check","false");
                    $(this).css("background-position","1px 1px");
                    $(".check-item").attr("data-check","false");
                    $(".check-item").css("background-position","1px 1px");

                    $(".delete-team").css("color","#b1b1b1");
                    $(".delete-team").attr("disable","true");
                    $(".delete-team").removeClass("hoverDel");
                }
                event.stopPropagation();
            });

            /*删除团队事件*/
            $(".member-manage").find(".delete-team").off("click").on("click",function (event) {
                if(confirm("确定要删除此团队吗？")){


                }
                event.stopPropagation();
            });

            /*分配人员事件*/
            $(".member-manage").find(".assignUser").off("click").on("click",function (event) {
                var validate;

                //当前组分配人员数组
                var assignUsers = [];
                require.async(["./css/salesTeam/assignUser.css", "./tpl/salesTeam/assignUser.html"], function (css, tempHtml) {
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "分配人员",
                        content: tempHtml,
                        width: 550,
                        height: 400,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var name = $(".selectUser").val();
                            var id = $(".selectUser").attr("data-val");
                            //invokeServer.assignGroupMember();

                        }
                    });

                    //加载自动完成控件 绑定通讯录人员数据
                    var $setAdmin = $("#selectUser");
                    require("autoCompletePath/autoComplete");
                    invokeServer.getDepartUsers(cache.rootDept.id,1,10000,function(data){
                        if ($.isArray(data.info.records)) {
                            var dataA = [];
                            $.each(data.info.records, function (i, item) {
                                var info = { name: item.userName, id: item.id };
                                dataA.push(info);
                            });
                            $setAdmin.autoComplete({
                                data: dataA,
                                request: {
                                    url: "",
                                    type: "",
                                    data: ""
                                },
                                textField: "name",
                                valueField: "id",
                                callback: function (retval, items, $this) {
                                    //假如当前用户存在，则不重复添加
                                    if (assignUsers.indexOf(retval.value) == -1) {
                                        assignUsers.push(retval.value);
                                        var nodeTemp = '<div class="user_node"><div class="user" data-uid="{0}">{1}</div><div class="delete" title="删除">X</div></div>'.format(retval.value, retval.title);

                                        $(".salesTeam-users").append(nodeTemp);
                                    }
                                    //绑定删除事件
                                    $(".salesTeam-users").on("click", ".delete", function () {
                                        var uid = $(this).parent().find(".user").attr("data-uid");
                                        $(this).parent().fadeOut(300, function () {
                                            $(this).remove();
                                            var index = assignUsers.indexOf(uid);
                                            assignUsers.splice(index, 1);
                                        });
                                    });
                                }
                            });
                        }
                    },null);

                    //加载验证插件 并注册需要验证的输入框
                    //require("formValidation");
                    validate = $(".salesTeam-add-pop input").simpleValidate();
                });
            });

            /*添加团队*/
            $(".member-manage").find(".add-team").off("click").on("click",function () {
                var validate;

                require.async(["./css/salesTeam/assignUser.css", "./tpl/salesTeam/addTeam.html"], function (css, tempHtml) {
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "创建团队",
                        content: tempHtml,
                        width: 550,
                        height: 350,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var gName = $("#lead_create_team").val();
                            var admin=$("#set_admin").attr("data-val");
                            invokeServer.createGroup(gName, function (data) {
                                invokeServer.setGroupAdmin(admin, data.id, function (info) {
                                   //alert(JSON.stringify(info));
                                });
                            }, function (error) {
                                //创建团队失败
                            });

                        }
                    });

                    //加载自动完成控件 绑定通讯录人员数据
                    var $setAdmin = $("#set_admin");
                    require("autoCompletePath/autoComplete");
                    invokeServer.getDepartUsers(cache.rootDept.id,1,10000,function(data){
                        if ($.isArray(data.info.records)) {
                            var dataA = [];
                            $.each(data.info.records, function (i, item) {
                                var info = { name: item.userName, id: item.id };
                                dataA.push(info);
                            });
                            $setAdmin.autoComplete({
                                data: dataA,
                                request: {
                                    url: "",
                                    type: "",
                                    data: ""
                                },
                                textField: "name",
                                valueField: "id",
                                callback: function (retval, items, $this) {
                                }
                            });
                        }
                    },null);

                    //加载验证插件 并注册需要验证的输入框
                    require("formValidation");
                    validate = $(".salesTeam-add-pop input").simpleValidate();
                });

            });
        }
    };

    var buildData=function(callback){
        invokeServer.getTeamList(function (data) {
            var teamList=[];
            $.each(data.userList,function(index,item){
                invokeServer.getAdminList(item.id,function(list){
                    var names="",ids="";
                    $.each(list.userList,function(i,n){
                        names+=n.name+",";
                        ids+= n.id+",";
                    });
                    names=names.replace(/\,$/,"");
                    ids=ids.replace(/\,$/,"");

                    teamList.push({
                        id:formatNullField(item.id),
                        name:formatNullField(item.name),
                        memberCount:formatNullField(item.memberCount),
                        createdAt:getSmpFormatDate(new Date(item.createdAt),true),
                        adminName:names,
                        adminId:ids
                    });

                });
            });
            callback(teamList);
        });
    };

    //用户操作
    var teamActions={
        renderPage:function($target,$title,dept){
            cache.rootDept=dept;

            buildData(function (data) {
                var temp =require("./tpl/salesTeam.html");
                var html=doT.template(temp)(data);
                $target.html(html);

                event.common();

                var title="销售团队"+"("+"共"+data.length+"个团队)";
                $title.text(title);

            });
        }
    };

    module.exports = teamActions;
});