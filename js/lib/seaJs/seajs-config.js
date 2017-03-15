seajs.config({
    base: "/",
    alias: {
        //lib
        "jquery": "js/lib/jquery/jquery-1.11.3.min",
        "zepto": "js/lib/zepto/zepto.min",
        "doT": "js/lib/doT/doT",
        "jqueryJson": "js/lib/jquery.json/jquery.json.min",
        "jqueryCookie": "js/lib/jquery.cookie/jquery.cookie",
        "jqueryCsv":"js/lib/jquery.csv/jquery.simple_csv.min",
        "jqueryDragmove":"js/lib/jquery.dragmove/jquery.dragmove",
        "jqueryRollbar":"js/lib/jquery.rollbar/main",
        "jqueryTabs":"js/lib/jquery.tabslet/jquery.tabslet.min",
        "JsHelper":"js/lib/JsHelper/JsHelper",
        "globalSetting":"modules/foundation/settings",

        "bootstrap":"modules/foundation/settings",

        //userManage
        "enterpriseContacts":"modules/userManage/enterpriseContacts/enterpriseContacts",
        "orgStructure":"modules/userManage/orgStructure/orgStructure",
        "userRoleManage":"modules/userManage/userRoleManage/userRoleManage",
        "workChangeManage":"modules/userManage/workChangeManage/workChangeManage",
        "teamManage":"modules/userManage/teamManage/teamManage",
        "memberManage":"modules/userManage/memberManage/memberManage",

        //ProductManage
        "productList":"modules/ProductManage/productList/productList",
        "addNewProduct":"modules/ProductManage/productList/addNewProduct",
        "productVerify":"modules/ProductManage/productVerify/productVerify",
        "productSalesReport":"modules/ProductManage/productSalesReport/productSalesReport",
        "productSoldLibrary":"modules/ProductManage/productSoldLibrary/productSoldLibrary",
        "newProduct":"modules/ProductManage/newProduct/newProduct",
        "distributeLimit":"modules/ProductManage/distributeLimit/distributeLimit",

        //clientResManageModule
        "leadPool":"modules/clientResManage/LeadManagement/main",
        "importLead":"modules/clientResManage/importLead/importLead",
        "memberPool":"modules/clientResManage/memberPool/memberPool",
        "cooperationChannel":"modules/clientResManage/cooperationChannel/cooperationChannel",
        "clientStatistic":"modules/clientResManage/clientStatistic/clientStatistic",

        //operationManageModule
        "reserveManage":"modules/operationManage/reserveManage/reserveManage",
        "formManage":"modules/operationManage/formManage/formManage",
        "performReport":"modules/operationManage/performReport/performReport",
        "contractSign":"modules/operationManage/contractSign/contractSign",
        "contractArchive":"modules/operationManage/contractArchive/contractArchive",

        //Popup Layer
        "popupLayer":"modules/foundation/popupLayer",
        "waitloading":"modules/foundation/waitloading",

        //Plugins-----------------------------------------------------------------
        "simpleShowDialog":"js/Plugins/simpleDialog/simpleShowDialog",
        "formValidation":"js/Plugins/simpleValidate/simpleValidate",
        "jqueryPlaceholder":"js/lib/jquery.placeholder/jquery.placeholder.min",
        "simpleSearch":"js/Plugins/simpleSearch/simpleSearch",
        "simpleDropDown":"js/Plugins/simpleDropDown/simpleDropDown"

    },
    paths:{
        //Plugins:TreeView
        "treeViewPath":"js/Plugins/treeView",

        //Plugins:customPager
        "PagerPath":"js/Plugins/customPager",

        //Plugins:autoComplete
        "autoCompletePath":"js/Plugins/autoComplete",

        //modules user-role
        "userRolePath":"modules/userManage/",

        //modules foundation
        "modulesCommPath":"modules/foundation/",

        //modules ProductManage
        "ProductManagePath":"modules/ProductManage/",

        //datepicker
        "datepickerPath":"js/lib/datepicker/",

        //scrollablePath
        "scrollablePath":"js/lib/scrollable/"

    },
    map: [
        [/^(.*\.(?:css|js|htm))(\?.*)?$/i, '$1?20150718']
    ]
});
