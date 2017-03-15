/**
 * Created by 雯涛 on 2015/8/4.
 */
define(function (require, exports, module) {
    var doT=require("doT");
    //调用远程服务器获取数据
    var invokeServer=require("./business");
    //引用企业通讯录接口
    var enterContact=require("enterpriseContacts");
    //公海池ID
    var seaLeadId="";
    //线索总数
    var leadsAllCount="";
    //存储页面渲染数据
    var staticData;

    //自定义分配线索给团队
    $("#menu_content").on("click", ".customAssign", function () {
        require.async(["./tpl/popAvg.html","./css/avgPopTable.css","popupLayer"],function(conTem,conCss,popup){
            var html = doT.template(conTem)({all:leadsAllCount,groups:staticData.groups});
            //加载弹出层
            require("simpleShowDialog");
            $(window).simpleShowDialog({
                title: "自定义分配",
                content: html,
                width:500,
                height:400,
                actions:["submit","cancel"],
                onSubmit:function(){
                    var groupInfo=[];
                    var total=0;
                    //提取组ID 和 分配线索数
                    $(".cfyLeadTeam").each(function(i,item){
                        if(!isNullOrEmpty($(item).val())){
                            var count=Number($(item).val());
                            total=total+count;
                            var gid= $(item).attr("data-gid");
                            groupInfo.push({gid:gid,count:count});
                        }
                    });
                    if(total>leadsAllCount){
                        alert("总分配数不能超过总线索数");
                        return false;
                    }
                    else{
                        //对每个组分配线索
                        $.each(groupInfo,function(index,item){
                            invokeServer.getLeadsPoolList(seaLeadId,1,item.count,2,function(data) {
                                if (data.status == 0) {
                                    if($.isArray(data.leads.records)){
                                        var leadIds =data.leads.records.superJoin(',');
                                        invokeServer.assignLeadsToGroup(item.gid,leadIds,function(req){
                                            if(req.status==0){
                                            }
                                            else{
                                            }
                                        },function(error){
                                        });
                                    }
                                }
                            });
                            //invokeServer.assignLeadsToGroup(item.gid,leadIds,function(data){});
                        });
                    }
                    return true;
                }
            });
        });
    });

    //平均分配线索给团队
    $("body").on("click", ".lead_pool_avg .avgAssign", function () {
        var allNumber=leadsAllCount;
        if($(".assignCount").val()!=""){
            allNumber=Number($(".assignCount").val());
        }
        //当前线索团队的个数
        var length=staticData.groups.length;
        var avg=parseInt(allNumber/length);
        var rail=parseInt(allNumber%length);
        $(".cfyLeadTeam").each(function(i,item){
            if(rail>0){
                $(item).val(avg+1);
                rail--;
            }
            else{
                $(item).val(avg);
            }
        });
    });

    //添加员工
    $("body").on("click", ".lead_pool_manage .groupnodeAssginStaff", function () {
        //这里需要获取组ID
        $gNode=$(this).parent();
        //当前组分配人员数组
        var assignUsers=[];
        require("./css/addUser.css");
        var html=require("./tpl/addUser.html");
        //加载弹出层
        require("simpleShowDialog");
        $(window).simpleShowDialog({
            title: "添加用户",
            content: html,
            width:500,
            height:350,
            actions:["submit","cancel"],
            onSubmit:function(){
                var uids=assignUsers.join(',');
                var gid=$gNode.attr("data-gid");
                invokeServer.assignGroupMember(uids,gid,function(data){
                    if(data.status==0){
                        //这里分配用户成功
                        return true;
                    }
                    else{
                        return false;
                    }
                },function(error){
                    return false;
                });
            }
        });

        //绑定自动完成控件
        var $addUser=$("#lead_add_user");
        enterContact.getContactsInfo(function(data){
            require.async("autoCompletePath/autoComplete",function(autoComplete){
                var dataA=[];
                if($.isArray(data.allUsers)) {
                    $.each(data.allUsers, function (i, item) {
                        var info = {name: item.name, uid: item.uid};
                        dataA.push(info);
                    });
                    $addUser.autoComplete({
                        data: dataA,
                        request: {
                            url: "",
                            type: "",
                            data: ""
                        },
                        textField: "name",
                        valueField: "uid",
                        callback: function (retval, items, $this) {
                            //假如当前用户存在，则不重复添加
                            if(assignUsers.indexOf(retval.value)==-1){
                                assignUsers.push(retval.value);
                                var nodeTemp='<div class="user_node"><div class="user" data-uid="{0}">{1}</div><div class="delete" title="删除">X</div></div>'.format(retval.value,retval.title);

                                $(".lead_add_user_pop .lead_users").append(nodeTemp);
                            }
                            //绑定删除事件
                            $("body .cfyPopuplay").on("click",".delete",function(){
                                var uid=$(this).parent().find(".user").attr("data-uid");
                                $(this).parent().fadeOut(300,function(){
                                    $(this).remove();
                                    var index=assignUsers.indexOf(uid);
                                    assignUsers.splice(index,1);
                                });
                            });
                        }
                    });
                }
            });
        });
    });

    //创建团队
    $("#menu_content").on("click", ".createTeam", function () {
        //importLeads();
        require.async(["./css/createTeam.css","./tpl/createTeam.html"],function(css,tempHtml){
            //加载弹出层
            require("simpleShowDialog");
            $(window).simpleShowDialog({
                title: "添加用户",
                content: tempHtml,
                width:450,
                height:200,
                actions:["submit","cancel"],
                onSubmit:function(){
                    var gName=$("#lead_create_team").val();
                    invokeServer.createGroup(gName,function(data){
                        if(data.status==0){
                            return true;
                        }
                    },function(error){
                        return false;
                    });
                }
            });
        });
    });

    //导入线索
    function importLeads(){
        var date=new Date();
        var se=date.getSeconds();
        //目前用来测试创建线索
        var leads={
            "leads": [
                {
                    "tags":"asdf",
                    "post":"asdf",
                    "dbcVarchar1":"asdf",
                    "email":"asdf",
                    "dbcVarchar3":"asdf",
                    "dbcVarchar2":"asdf",
                    "name":"asdf",
                    "comment":"asdf",
                    "companyName":"asfd",
                    "mobile":"20000"+se
                }
            ]};
        invokeServer.importLead(seaLeadId,leads,function(data){
            if(data.status==0){
                alert("导入线索成功！");
            }
        });
    }

    function isNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    }

    Array.prototype.superJoin=function(value){
        var ids="";
        for (var i=0,n=this.length; i<n; i++){
            ids=ids+this[i].id+value;
        }
        ids=ids.substr(0,ids.length-1);
        return ids;
    }

    Array.prototype.indexOf = function(value){
        for (var i=0,n=this.length; i<n; i++){
            if (this[i] === value){
                return i;
            }
        }
        return -1;
    }

    String.prototype.format = String.prototype.f = function () {
        var s = this,
            i = arguments.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    var buildHtml=function(groups){
        //获取线索的长度和ID  简单信息
        var htmlTpl = require("./tpl/index.html");
        staticData = {groups:groups};
        var html = doT.template(htmlTpl)(staticData);
        require("./css/index.css");
        $("#menu_content").html(html);
    };



    //初始化，加载数据 这里需要调用接口
    var actions={
        init:function(){
            //获取团队列表，默认第一个是公海池，getGroupList：为了获取公海池ID 并 缓存每个团队信息
            invokeServer.getGroupList(function(data){
                if(data.status==0){
                    seaLeadId=data.groupList[0].id;
                    data.groupList.splice(0,1);
                    var allGroup=data.groupList;
                    //给公海池设置管理员
                    invokeServer.setGroupAdmin("",seaLeadId,function(data){
                        alert(JSON.stringify(data));
                        if(data.status==0){

                        }
                    });

                    //渲染主页面，团队信息
                    buildHtml(allGroup);
                    //获取每个团队的全部和未分配线索
                    $.each(allGroup,function(index,item){

                        //1 表示总数
                        invokeServer.getSeaLeadIds(item.id,1,function(data){
                            if(data.status==0){
                                //numArray.push({num:data.ids.length});
                                $(".groupnode[data-gid="+item.id+"]").find(".team_all").text(data.ids.length);
                            }
                        });
                        //2 表示为分配数
                        invokeServer.getSeaLeadIds(item.id,2,function(data){
                            if(data.status==0){
                                $(".groupnode[data-gid="+item.id+"]").find(".team_last").text(data.ids.length);
                            }
                        });

                    });
                    //获取线索池总数
                    invokeServer.getSeaLeadIds(seaLeadId,2,function(data){
                        if(data.status==0){
                            $(".leads_all").text(data.ids.length);
                            leadsAllCount=data.ids.length;
                        }
                    });

                }
            });
        }
    };

    module.exports=actions;
});