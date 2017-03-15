/**
 * Created by Moment on 2015/7/30.
 */
define(function (require, exports, module) {
    //鼠标经过事件
    $("#menu_content").on({
        mouseover:function(){
            $(this).removeClass("trEvenBackColor");
            $(this).removeClass("trOddBackColor");
            $(this).addClass("trMouseover");
        },
        mouseout:function(){
            $(this).removeClass("trMouseover");
            $(".proveri_table tr:even").addClass("trEvenBackColor");
            $(".proveri_table tr:odd").addClass("trOddBackColor");
        }
    },".proveri_table tbody>tr");

    var init=function(){
        require.async(["doT","./tpl/index.html"],function(doT,htmlTpl){
            var tableData = {
                items:
                    [
                        {proName:"理财一号",fund:"保守",income:"返现",region:"200万",years:"36个月",yearRate:"7.5%",backRate:"75%/300万"},
                        {proName:"理财二号",fund:"保守",income:"返现",region:"200万",years:"36个月",yearRate:"7.5%",backRate:"75%/300万"},
                        {proName:"理财三号",fund:"保守",income:"返现",region:"200万",years:"36个月",yearRate:"7.5%",backRate:"75%/300万"}
                    ]};
            var html = doT.template(htmlTpl)(tableData);
            require("./css/productVerify.css");
            $("#menu_content").fadeOut(500,function(){
                $("#menu_content").html(html).fadeIn(500);
                require.async(["PagerPath/customPager","PagerPath/css/customPager.css"],function(customPager,pagerCss){
                    $(".proveri_pager").customPager({
                        curPage:1,
                        allCount:10,
                        bindData:function(data,index){
                            //模拟分页数据
                            var trHtml="";
                            var trHtmlTemp='<tr class="{0}"><td class="proveri_tbody_op"><select><option>审核中</option><option>审核成功</option><option>审核失败</option></select></td><td class="proveri_tbody_td">{1}</td><td class="proveri_tbody_td">{2}</td><td class="proveri_tbody_td">{3}</td><td class="proveri_tbody_td">{4}</td><td class="proveri_tbody_td">{5}</td><td class="proveri_tbody_td">{6}</td><td class="proveri_tbody_td">{7}</td></tr>';
                            for(var i=0;i<data.items.length;i++)
                            {
                                var item=data.items[i];
                                var trClass="trOddBackColor";
                                if(i%2==1){
                                    trClass="trEvenBackColor";
                                }
                                trHtml=trHtml+trHtmlTemp.format(trClass,item.proName+index,item.fund,item.income,item.region,item.years,item.yearRate,item.backRate);
                            }
                            $(".proveri_table").find("tbody").fadeOut(500,function(){
                                $(this).html(trHtml).fadeIn(500);
                            });
                        }
                    });
                });
            });
        });
    };
    exports.init=init;
});