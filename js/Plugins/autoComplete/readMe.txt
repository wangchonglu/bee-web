
本插件是自定义扩展的jQuery插件，其使用方法如下：

1.在js文件使用前，先要将自动完成插件的css js文件引用进来
    require.async(["autoCompletePath/autoComplete","autoCompletePath/css/autoComplete.css"],function(autoComplete,autoCss){});

2.使用如下方法给当前的文本框绑定自动完成控件，本控件有两种数据绑定方式：

    一：使用本地数据，参数data不为undefined时，则为默认本地数据绑定源
    二：参数data为undefined时，则通过request对象去异步请求数据，request.url:异步请求服务器地址，request.type:异步请求方式，request.data:异步请求的数据
    三：titleField：数据显示值，valueField：数据隐藏值（标示作用）
    四：callback为回调函数，retval：当前数据项，items：额外请求数据数组

调用示例：
    $("#work_change_user").autoComplete({
        data:dataA,
        request:{
            url:"www.baidu.com",
            type:"get",
            data:"张三"
        },
        textField:"name",
        valueField:"phone",
        callback:function(retval,items){

        }
    });

    注意：dara 和  request 参数只能提供一组，如果都提供，插件将优先选择data参数进行构造数据