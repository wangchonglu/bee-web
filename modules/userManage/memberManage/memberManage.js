/**
 * Created by Moment on 2015/9/6.
 */
define(function (require, exports, module) {
    //dot数据模板
    var doT = require("doT");

    //加载验证插件 并注册需要验证的输入框
    require.async("formValidation");

    //调用远程服务器获取数据
    var invokeServer = require("./business");

    //加载等待弹出层
    var waitloading=undefined;
    require.async("waitloading", function (wait) {
        waitloading=wait;
    });

    /*缓存*/
    var cache = {
        //存储公司部门树结构
        deptTree:{},
        //存储公司所有部门（包括上下级），数组类型：id,name,deptcode...
        deptArrayInfo:[],
        //保存当前部门ID，分页时用到
        CurrentDeptId:"",
        //根部门信息：id,name
        rootDept:{}
    };

    /*页面事件*/
    var events = {
        user: function () {
            /*添加成员*/
            $(".member-manage").find(".add-member").off("click").on("click",function () {
                var validate;

                require.async(["./tpl/popAddUser.html", "./css/popAddUser.css"], function ( conTem, conCss) {
                    var html = doT.template(conTem)();
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "新增员工",
                        content: html,
                        width: 550,
                        height: 380,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var name = $(".popAddUser .add_name").val();
                            var deptId = $(".popAddUser .add_dept").attr("data-did");
                            var phone = $(".popAddUser .add_phone").val();
                            var email = $(".popAddUser .add_email").val();
                            if(!facilities.isNullOrEmpty(deptId)){
                                invokeServer.AddInfo(name, deptId, phone, email,undefined, function (data) {
                                    render.toPage(1, 10, 2);
                                    //创建成功发送短信密码
                                    invokeServer.SendMessage(data.uid);
                                }, function (error) {
                                    return false;
                                });
                            }

                        }
                    });

                    $("#enter_contact_dept").click(function(){
                        var deptActions=require("./deptActions");
                        deptActions.showTree(cache.deptTreeNoRoot,$(this));
                    });

                    //注册需要验证的输入框
                    validate = $(".popAddUser input").simpleValidate();
                });

            });

            /*移动成员（修改部门）*/
            $(".member-manage").find(".opMoveUser").off("click").on("click",function () {
               if($(".user-move").attr("disable")=="false"){
                   var deptActions=require("./deptActions");
                   var uids="";
                   $(".user-check-item").each(function(index,item){
                       if($(item).attr("data-check")=="true"){
                           uids+=$(item).parent().parent().attr("data-uid")+',';
                       }
                   });
                   uids=uids.replace(/\,$/,"");

                   deptActions.showTree(cache.deptTreeNoRoot,$(this),function(name,id){
                       invokeServer.moveUser(uids,id,name,function(data){
                           actions.init();
                       });
                   });


               }
            });

            /*查看成员详情信息*/
            $(".member-manage").on("click",".tr-member", function () {
                var curUid = $(this).attr("data-uid");
                var showUserInfo=require("./showUserInfo");
                showUserInfo.show(curUid);
            });

            /*全选/单选事件*/
            $(".member-manage").on("click",".user-check-item", function (event) {
                if($(this).attr("data-check")=="false"){
                    $(this).attr("data-check","true");
                    $(this).css("background-position","-24px 1px");
                }else{
                    $(this).attr("data-check","false");
                    $(this).css("background-position","1px 1px");
                }
                var flag=false;
                $(".user-check-item").each(function(index,item){
                    if($(item).attr("data-check")=="true"){
                        flag=true;
                        return;
                    }
                });

                if(flag==true){
                    $(".user-move").css("color","#666");
                    $(".user-move").attr("disable","false");
                    $(".opMoveUser").addClass("hoverOp");
                }else{
                    $(".user-move").css("color","#b1b1b1");
                    $(".user-move").attr("disable","true");
                    $(".opMoveUser").removeClass("hoverOp");
                }
                event.stopPropagation();
            });

            /*全选/单选事件*/
            $(".member-manage").on("click",".user-check-all",function (event) {
                if($(this).attr("data-check")=="false"){
                    $(this).attr("data-check","true");
                    $(this).css("background-position","-24px 1px");
                    $(".user-check-item").attr("data-check","true");
                    $(".user-check-item").css("background-position","-24px 1px");
                    $(".user-move").css("color","#666");
                    $(".user-move").attr("disable","false");
                    $(".opMoveUser").addClass("hoverOp");
                }else{
                    $(this).attr("data-check","false");
                    $(this).css("background-position","1px 1px");
                    $(".user-check-item").attr("data-check","false");
                    $(".user-check-item").css("background-position","1px 1px");
                    $(".user-move").css("color","#b1b1b1");
                    $(".user-move").attr("disable","true");
                    $(".opMoveUser").removeClass("hoverOp");
                }
                event.stopPropagation();
            });

            $(".member-manage").find(".txt-search").off("click").on("keydown",function (event) {
                if(event.keyCode==13){
                    //这里调用搜索接口
                    render.search($(this).val());
                }
            });

            $(".member-manage").find(".img-search").off("click").on("click",function (event) {
                //这里调用搜索接口
                render.search($(this).val());
            });

        },
        dept:function(){
            /*主页面组织架构管理按钮点击事件*/
            $(".member-manage").find(".dept-op-edit").off("click").on("click",function (event) {
                require.async(["./tpl/editDept.html", "./css/editDept.css"], function (conTem, conCss) {
                    var html = doT.template(conTem)();
                    //加载弹出层
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "组织架构管理",
                        content: html,
                        width: 600,
                        height: 600,
                        isShowAction:false,
                        onSubmit: function () {

                            return true;
                        }
                    });

                    $(".edit-dept-pop .dept-trees").TreeView({
                        data: cache.deptTree,
                        template: "<span data-id='{id}' >{name}</span>",
                        itemsFiled:"subs",
                        select: function (target) {
                            if(target.find("span").attr("data-id")==cache.rootDept.id){
                                $(".dept-ops-edit span").css("color","#b1b1b1");
                                $(".dept-ops-edit").attr("disable","true");
                                $(".dept-ops-delete span").css("color","#b1b1b1");
                                $(".dept-ops-delete").attr("disable","true");
                            }else{
                                $(".dept-ops-edit span").css("color","#666");
                                $(".dept-ops-edit").attr("disable","false");
                                $(".dept-ops-delete span").css("color","#666");
                                $(".dept-ops-delete").attr("disable","false");
                            }
                        }
                    });

                    //绑定部门下增删改查事件
                    events.deptOperate();

                });
            });
        },
        /*主页面编辑部门弹出层内部的所有事件：增删改查*/
        deptOperate:function(){
            /*添加部门事件*/
            $(".edit-dept-pop").on("click",".dept-ops-add",function (event) {
                if($(this).attr("disable")!="true"){
                    //处理添加部门的归属部门
                    var obj={};
                    if($(".edit-dept-pop .itemSelected").length>0){
                        obj.id=$(".edit-dept-pop .itemSelected").find("span").attr("data-id");
                        obj.name=$(".edit-dept-pop .itemSelected").find("span").text();
                    }else{
                        obj=cache.rootDept;
                    }

                    //数据验证对象
                    var validate;

                    //加载弹出层
                    require("./css/deptOpsAdd.css");
                    var temp=require("./tpl/deptOpsAdd.html");
                    var html = doT.template(temp)(obj);
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "添加部门",
                        content: html,
                        width: 550,
                        height: 350,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }

                            //随机生成一个部门id
                            //var id=parseInt(Math.random()*100000000);
                            var pid=$(".deptOpsAdd-pop .parent-dept").attr("data-did");
                            var name=$(".deptOpsAdd-pop .dept-name").val();
                            invokeServer.AddDeptInfo(name, "1", pid, function (message) {
                                //创建部门成功，返回部门id
                                var id=message.id;

                                var $target=$(".edit-dept-pop span[data-id="+pid+"]").parent().parent();
                                if($target.find("ul").length>0){
                                    var temp='<li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="'+id+'">'+name+'</span></span></li>';
                                    $target.find("ul").append(temp);
                                }else{
                                    var temp='<ul class="" style="display: block;"> <li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="'+id+'">'+name+'</span></span></li></ul>';
                                    $target.append(temp);
                                    $(".edit-dept-pop span[data-id="+pid+"]").parent().find(".duCss").addClass("openDu");
                                }


                                var $mainPageTree=$(".nav-tree span[data-id="+pid+"]").parent().parent();
                                if($mainPageTree.find("ul").length>0){
                                    var temp='<li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="'+id+'">'+name+'</span></span></li>';
                                    $mainPageTree.find("ul").append(temp);
                                }else{
                                    var temp='<ul class="" style="display: block;"> <li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="'+id+'">'+name+'</span></span></li></ul>';
                                    $mainPageTree.append(temp);
                                    $(".nav-tree span[data-id="+pid+"]").parent().find(".duCss").addClass("openDu");
                                }

                                //更新部门树结构
                                deptActions.updateDeptTree();
                            });
                            return true;
                        }
                    });
                    //绑定选择部门事件
                    events.subOperate.selectDept();

                    //注册需要验证的输入框
                    validate = $(".deptOpsAdd-pop input").simpleValidate();
                }
            });

            /*删除部门事件*/
            $(".edit-dept-pop").on("click",".dept-ops-delete",function (event) {
                if($(this).attr("disable")!="true") {
                    if (confirm("确定要删除吗？")) {
                        var $target = $(".edit-dept-pop .itemSelected").parent();
                        if ($target.find("ul").length > 0) {
                            alert("当前部门不能删除");
                            return;
                        } else {
                            var id = $(".edit-dept-pop .itemSelected").find("span").attr("data-id");
                            invokeServer.DeleteDeptInfo(id, function (data) {
                                if ($target.siblings().length == 0) {
                                    $target.parent().parent().find(".dataspan").removeClass("hasItems");
                                    $target.parent().parent().find(".duCss").removeClass("openDu");
                                    $target.parent().remove();
                                } else {
                                    $target.fadeOut(500).remove();
                                }

                                //更新部门树结构
                                deptActions.updateDeptTree();

                                //更新主页面的部门树
                                var $mainPageTree = $(".nav-tree").find("span[data-id='" + id + "']").parent().parent();
                                if ($mainPageTree.siblings().length == 0) {
                                    $mainPageTree.parent().parent().find(".dataspan").removeClass("hasItems");
                                    $mainPageTree.parent().parent().find(".duCss").removeClass("openDu");
                                    $mainPageTree.parent().remove();
                                } else {
                                    $mainPageTree.fadeOut(500).remove();
                                }


                            }, function (error) {
                                //TODO Moment 这里做删除部门出错处理
                            });
                        }
                    }
                }
            });

            /*编辑部门事件*/
            $(".edit-dept-pop").on("click",".dept-ops-edit", function (event) {
                if($(this).attr("disable")!="true") {
                    $target = $(".edit-dept-pop .itemSelected").find("span");
                    //处理添加部门的归属部门
                    var obj = {};
                    obj.id = $target.attr("data-id");
                    obj.name = $target.text();
                    var item = deptActions.getDeptById(obj.id);
                    obj.pid = item.parentId;
                    obj.pname = item.parentName;

                    //数据验证对象
                    var validate;

                    //加载弹出层
                    require("./css/deptOpsEdit.css");
                    var temp = require("./tpl/deptOpsEdit.html");
                    var html = doT.template(temp)(obj);
                    require("simpleShowDialog");
                    $(window).simpleShowDialog({
                        title: "编辑部门",
                        content: html,
                        width: 550,
                        height: 350,
                        actions: ["submit", "cancel"],
                        onSubmit: function () {
                            //提交验证
                            if (!validate.formValidate()) {
                                return false;
                            }
                            var pid = $(".deptOpsEdit-pop .parent-dept").attr("data-did");
                            var name = $(".deptOpsEdit-pop .dept-name").val();
                            var id = $(".deptOpsEdit-pop .dept-name").attr("data-did");
                            if (pid == id) {
                                alert("归属部门不能为自己");
                                return false;
                            }
                            invokeServer.UpdateDeptInfo(id, name, pid, function (message) {
                                if (pid == obj.pid) {
                                    $target.text(name);
                                    $(".nav-tree .itemSelected").find("span").text(name);
                                } else {
                                    //做部门移动操作
                                    //添加新结构
                                    var $parent = $(".edit-dept-pop span[data-id=" + pid + "]").parent().parent();
                                    if ($parent.find("ul").length > 0) {
                                        var temp = '<li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="' + id + '">' + name + '</span></span></li>';
                                        $parent.find("ul").first().append(temp);
                                    } else {
                                        var temp = '<ul class="" style="display: block;"> <li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="' + id + '">' + name + '</span></span></li></ul>';
                                        $parent.append(temp);
                                        $(".edit-dept-pop span[data-id=" + pid + "]").parent().find(".duCss").addClass("openDu");
                                    }

                                    //删除旧结构
                                    var $item = $(".edit-dept-pop .itemSelected").parent();
                                    if ($item.siblings().length == 0) {
                                        $item.parent().parent().find(".dataspan").removeClass("hasItems");
                                        $item.parent().parent().find(".duCss").removeClass("openDu");
                                        $item.parent().remove();
                                    } else {
                                        $item.fadeOut(500).remove();
                                    }


                                    //更新主页面的部门树
                                    var $mainPageTree = $(".nav-tree span[data-id=" + pid + "]").parent().parent();
                                    if ($mainPageTree.find("ul").length > 0) {
                                        var temp = '<li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="' + id + '">' + name + '</span></span></li>';
                                        $mainPageTree.find("ul").append(temp);
                                    } else {
                                        var temp = '<ul class="" style="display: block;"> <li><span class="dataspan"><i class="duCss"></i><i class="folderCss closeFolder"></i><span data-id="' + id + '">' + name + '</span></span></li></ul>';
                                        $mainPageTree.append(temp);
                                        $(".nav-tree span[data-id=" + pid + "]").parent().find(".duCss").addClass("openDu");
                                    }

                                    var $mainPageTree = $(".nav-tree").find("span[data-id='" + id + "']").parent().parent();
                                    if ($mainPageTree.siblings().length == 0) {
                                        $mainPageTree.parent().parent().find(".dataspan").removeClass("hasItems");
                                        $mainPageTree.parent().parent().find(".duCss").removeClass("openDu");
                                        $mainPageTree.parent().remove();
                                    } else {
                                        $mainPageTree.fadeOut(500).remove();
                                    }

                                }

                                //更新部门树结构
                                deptActions.updateDeptTree();
                            });
                            return true;
                        }
                    });
                    //绑定选择部门事件
                    events.subOperate.selectDept();

                    //注册需要验证的输入框
                    validate = $(".deptOpsEdit-pop input").simpleValidate();
                }
            });

        },
        /*主页面编辑部门弹出层内部的所有事件增删改查下面弹出层的事件*/
        subOperate:{
            selectDept:function(){
                /*选择部门事件*/
                $(".deptOpsAdd-pop,.deptOpsEdit-pop").on("click", ".parent-dept", function (event) {
                    var deptActions=require("./deptActions");
                    deptActions.showTree(cache.deptTree,$(this));
                });
            }
        }
    };

    /*工具*/
    var facilities = {
        isNullOrEmpty: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /*处理空字段 为null 和 undefined 情况*/
        formatNullField: function (obj) {
            if (obj == undefined || obj == null || obj == "") {
                return "";
            }
            else {
                return obj;
            }
        },
        /*生成html flag=0,表示页面模板，flag=1表示tr模板*/
        buildHtml: function (data, flag) {
            require("./css/index.css");
            var htmlTpl;
            if (flag == 0) {
                htmlTpl = require("./tpl/index.html");
            }else if (flag == 1){
                htmlTpl = require("./tpl/pagerTemp.html");
            }
            else if (flag == 2){
                htmlTpl = require("./tpl/deptUser.html");
            }
            var html = doT.template(htmlTpl)(data);
            return html;
        }
    };

    //部门操作
    var deptActions={
        getDeptTree:function(callback){
            invokeServer.GetDeptInfo(function (data) {
                //存储全公司所有部门
                cache.deptArrayInfo = [];
                cache.deptArrayInfo = deptActions.getAllDeptInfo(data, null, null, cache.deptArrayInfo);

                var dataTree={
                    subs:[
                        {departCode: data.tree.departCode, departType:data.tree.departType, id: data.tree.id, name: "公司后台",subs:data.tree.subs},
                        {departCode: undefined, departType:undefined, id: "team", name: "销售团队",subs:[]},
                        {departCode: undefined, departType:undefined, id: "auth", name: "待认证员工",subs:[]},
                        {departCode: undefined, departType:undefined, id: "reverse", name: "离职员工",subs:[]}

                    ]
                };
                //缓存根部门信息
                //cache.rootDept={id:data.tree.id,name:data.tree.name};
                cache.rootDept={id:data.tree.id,name:"公司后台"};
                //第一次加载保存公司id
                cache.CurrentDeptId=data.tree.id;
                cache.deptTree={
                    subs:[
                        {departCode: data.tree.departCode, departType:data.tree.departType, id: data.tree.id, name: "公司后台",subs:data.tree.subs}
                    ]
                };
                cache.deptTreeNoRoot={
                    subs:data.tree.subs
                };

                callback(dataTree);
            }, function (error) {
                //处理加载数据出错
                $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
            });
        },
        getAllDeptInfo: function (data, parentId, parentName, deptArrayInfo) {
            if (!facilities.isNullOrEmpty(data.tree)) {
                var subs = false;
                var len=0;
                if (data.tree.subs != undefined) {
                    subs = true;
                    len=data.tree.subs.length;
                }
                var info = { id: data.tree.id, name: "公司后台", code: data.tree.departCode, parentId: undefined, parentName: undefined, child: subs,subsLength:len };
                deptArrayInfo.push(info);
                if (!facilities.isNullOrEmpty(data.tree.subs) && data.tree.subs.length > 0) {
                    return deptActions.getAllDeptInfo(data.tree.subs, data.tree.id, data.tree.name, deptArrayInfo);
                }
            }
            if (!facilities.isNullOrEmpty(data) && data.length > 0) {
                $.each(data, function (i, item) {
                    var subs = false;
                    var len=0;
                    if (item.subs != undefined) {
                        subs = true;
                        len=item.subs.length;
                    }
                    var info = { id: item.id, name: item.name, code: item.departCode, parentId: parentId, parentName: parentName, child: subs,subsLength:len };
                    deptArrayInfo.push(info);
                    if (!facilities.isNullOrEmpty(item.subs) && item.subs.length > 0) {
                        return deptActions.getAllDeptInfo(item.subs, item.id, item.name, deptArrayInfo);
                    }
                });
            }
            return deptArrayInfo;
        },
        getDeptArray: function (callback) {
            if (cache.deptArrayInfo.length > 0) {
                if ($.isFunction(callback)) {
                    callback(cache.deptArrayInfo);
                }
            }
            else {
                invokeServer.GetDeptInfo(function (data) {
                    cache.deptArrayInfo = deptActions.getAllDeptInfo(data, null, null, cache.deptArrayInfo);
                    if ($.isFunction(callback)) {
                        callback(cache.deptArrayInfo);
                    }
                });
            }
        },
        getDeptById: function (id) {
            var datas = cache.deptArrayInfo.filter(function (item) {
                return item.id == id;
            });
            return datas[0];
        },
        updateDeptTree:function(){
            invokeServer.GetDeptInfo(function (data) {
                //缓存根部门信息
                cache.rootDept={id:data.tree.id,name:"公司后台"};
                cache.deptTree={
                    subs:[
                        {departCode: data.tree.departCode, departType:data.tree.departType, id: data.tree.id, name: "公司后台",subs:data.tree.subs}
                    ]
                };

                //存储全公司所有部门
                cache.deptArrayInfo = [];
                cache.deptArrayInfo = deptActions.getAllDeptInfo(data, null, null, cache.deptArrayInfo);

                var dataTree={
                    subs:[
                        {departCode: data.tree.departCode, departType:data.tree.departType, id: data.tree.id, name: "公司后台",subs:data.tree.subs},
                        {departCode: undefined, departType:undefined, id: "team", name: "公司前台",subs:[]},
                        {departCode: undefined, departType:undefined, id: "auth", name: "待认证员工",subs:[]},
                        {departCode: undefined, departType:undefined, id: "reverse", name: "离职员工",subs:[]}

                    ]
                };

            });
        }
    };

    var render = {
        /*渲染页面*/
        toPage: function (pageIndex, displayCount) {
            deptActions.getDeptTree(function (depts) {
                var id=cache.CurrentDeptId;
                invokeServer.getDepartUsers(id,pageIndex, displayCount, function (data) {
                    if ($.isArray(data.info.records)) {
                        var html = facilities.buildHtml(data.info.records, 0);
                        $("#menu_content").html(html);

                        //修改页面布局时的border问题
                        $(".user-header").width($(".user-header").width()-2);
                        $(".user-header").css("margin-left","0");

                        //修改标题信息
                        var dcount=cache.deptTree.subs[0].subs.length;
                        var pcount=data.info.dataCount;
                        var title="公司后台("+dcount+"个部门，共"+pcount+"人)";
                        $(".user-title").text(title);

                        require("treeViewPath/treeView");
                        $(".nav-tree").TreeView({
                            data: depts,
                            template: "<span data-id='{id}' >{name}</span>",
                            itemsFiled:"subs",
                            select: function (target) {
                                var id = $(target).find("span").attr("data-id");

                                $(".hd-op").find(".add-team").hide();
                                $(".hd-op").find(".delete-team").hide();
                                $(".hd-op").find(".assigned-user").hide();

                                if (!facilities.isNullOrEmpty(id)) {
                                    switch(id){
                                        case "auth":{
                                            waitloading.show($(".every-part"));
                                            $(".hd-op").find(".op").hide();
                                            $(".hd-op").find(".add-member").hide();
                                            var applyUser=require("./applyUser");
                                            applyUser.renderPage(1,10,$(".every-part"),$(".user-title"));
                                            break;
                                        }
                                        case "reverse":{
                                            waitloading.show($(".every-part"));
                                            $(".hd-op").find(".op").hide();
                                            $(".hd-op").find(".add-member").hide();
                                            var resignUser=require("./resignUser");
                                            resignUser.renderPage(1,10,$(".every-part"),$(".user-title"));
                                            break;
                                        }
                                        case "team":{
                                            waitloading.show($(".every-part"));
                                            $(".hd-op").find(".op").hide();
                                            $(".hd-op").find(".add-member").hide();
                                            $(".hd-op").find(".add-team").show();
                                            $(".hd-op").find(".delete-team").show();
                                            $(".hd-op").find(".assigned-user").show();
                                            var salesTeam=require("./salesTeam");
                                            salesTeam.renderPage($(".every-part"),$(".user-title"),cache.rootDept);
                                            break;
                                        }
                                        default:{
                                            waitloading.show($(".every-part"));
                                            $(".hd-op").find(".op").show();
                                            $(".hd-op").find(".add-member").show();
                                            cache.CurrentDeptId=id;
                                            render.toPart(id);
                                        }
                                    }
                                }
                            }
                        });

                        //树之间分割线
                        $("span[data-id='team']").closest("li").css("border-bottom","solid 1px #E4E4E4");
                        $("span[data-id='team']").parent().parent().css("padding-bottom","20px");

                        //绑定事件
                        events.user();
                        events.dept();

                        //获取分页的总页数
                        var allCount = parseInt(data.info.dataCount / 10);
                        if (data.info.dataCount % 10 > 0) {allCount++; }
                        require("PagerPath/customPager");
                        $(".user-table-pager").customPager({
                            curPage: 1,
                            allCount: allCount,
                            bindData: function (curPageIndex, displayCount, maxCount) {
                                var id=cache.CurrentDeptId;
                                render.toTable(id,curPageIndex, displayCount);
                            }
                        });
                    }
                }, function (error) {
                    //处理加载数据出错
                    $("#menu_content").html("<div class='ajax_data_error'>数据请求出错了！/(ㄒoㄒ)/~~</div>");
                });
            });
        },
        /*渲染表格*/
        toTable: function (id,pageIndex, displayCount) {
            invokeServer.getDepartUsers(id,pageIndex, displayCount, function (data) {
                if ($.isArray(data.info.records)) {
                    var trHtml = facilities.buildHtml(data.info.records, 1);

                    var obj=cache.deptArrayInfo.filter(function(item){return item.id==id;})[0];
                    var title=obj.name+"("+obj.subsLength+"个部门，共"+data.info.dataCount+"人)";
                    $(".user-title").text(title);

                    $(".every-part").find("tbody").html(trHtml);
                }
            });
        },
        toPart: function (id) {
            invokeServer.getDepartUsers(id,1,10, function (data) {
                if ($.isArray(data.info.records)) {
                    var trHtml = facilities.buildHtml(data.info.records, 2);

                    var obj=cache.deptArrayInfo.filter(function(item){return item.id==id;})[0];
                    var title=obj.name+"("+obj.subsLength+"个部门，共"+data.info.dataCount+"人)";
                    $(".user-title").text(title);

                    $(".every-part").html(trHtml);

                    //获取分页的总页数
                    var allCount = parseInt(data.info.dataCount / 10);
                    if (data.info.dataCount % 10 > 0) {allCount++; }
                    require("PagerPath/customPager");
                    $(".user-table-pager").customPager({
                        curPage: 1,
                        allCount: allCount,
                        bindData: function (curPageIndex, displayCount, maxCount) {
                            cache.CurrentDeptId=id;
                            render.toTable(id,curPageIndex, displayCount);
                        }
                    });
                }
            });
        },
        search:function(keyword){
            invokeServer.searchUser(keyword,1,10,function(data){
                var tbHtml = facilities.buildHtml(data.allUsers, 2);
                var title="共"+data.total+"人)";
                $(".user-title").text(title);
                $(".every-part").html(tbHtml);

                require("PagerPath/customPager");
                $(".user-table-pager").customPager({
                    curPage: 1,
                    allCount: data.allPages,
                    bindData: function (curPageIndex, displayCount, maxCount) {
                        render.searchPager(keyword,curPageIndex, displayCount);
                    }
                });
            });
        },
        searchPager:function(keyword,curPageIndex, displayCount){
            //这里调用搜索接口
            invokeServer.searchUser(keyword,curPageIndex,displayCount,function(data){
                var tbHtml = facilities.buildHtml(data.allUsers, 2);
                tbHtml=$(tbHtml).find("tbody").html();
                var title="共"+data.total+"人)";
                $(".user-title").text(title);
                $(".every-part").find(".user-table tbody").html(tbHtml);
            });
        }
    };

    var actions = {
        init: function () {
            render.toPage(1, 10);
        }
    };

    module.exports = actions;
});
