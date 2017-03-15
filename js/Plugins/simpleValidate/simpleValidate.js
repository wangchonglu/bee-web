/**
 * Created by chonglu.wang on 2015/8/20.
 */
define(function (require, exports, module) {

    require('jquery');
    //require.async("./css/simpleDialog.css");

    var SimpleValidate = function ($inputs) {
        this.settings = {inputs: $inputs};
        //初始化
        initEvent(this.settings);

        var actions = {
            formValidate: function ($newInputs) {
                if ($newInputs == undefined) {
                    $newInputs = $inputs;
                }
                return validateFormImpl($newInputs);
            }
        };
        return actions;
    };

    //验证实现
    var validateFormImpl = function ($inputs) {

            $inputs.each(function (index, input) {
                validateImpl($(input),$inputs);
            });
            //返回验证是否成功
            return $inputs.next(".validate-box").length > 0 ? false : true;
        }
        ;
    //初始化事件
    var initEvent = function (settings) {
            var $inputs = settings.inputs;
            $inputs.on("blur", function (event) {
                validateImpl($(this),$inputs);//调用验证
                event.stopPropagation();
            }).on("input propertychange", function (event) {
                validateImpl($(this),$inputs);//调用验证
                event.stopPropagation();
            });
        }
        ;

    var showTipMsg = function (self, msg) {

        if (!isEmpty(msg)) {

            if (self.next(".validate-box").length <= 0) {
                var tipTpl = "<span class='validate-box' style='display: none'> <span class='validate-msg' data-jiantou='&#x25c0;' style='left:0px'>{0}</span> </span>";
                var tipHtml = tipTpl.format(msg, top);
                self.after(tipHtml).next().fadeIn("slow");
            } else {
                self.next(".validate-box").find(".validate-msg").html(msg);
            }

        } else {
            self.next(".validate-box").fadeOut("slow").remove();
        }

    };

    //配置默认提示语
    var defaultMsg = {
        requiredMsg: "此项必填.",
        emailMsg: "输入的邮箱格式不正确",
        phoneMsg: "输入的手机号码格式不正确",
        numberMsg: "输入必须为数字",
        telMsg: "输入的电话号码格式不正确",
        regMsg: "输入格式不正确",
        maxLengthMsg: "输入长度不能大于{0}",
        minLengthMsg: "输入长度不能小于{0}"
    };

    //表单验证的具体实现
    var validateImpl = function (self,$inputs) {

        var required = self.attr("required");
        var isCheckEmail = self.attr("validate-isEmail");
        var isCheckPhone = self.attr("validate-isPhone");
        var isCheckNumber = self.attr("validate-isNumber");
        var isCheckTel = self.attr("validate-isTel");
        var regText = self.attr("validate-reg");
        var maxLength = self.attr("validate-maxLength");
        var minLength = self.attr("validate-minLength");
        var validateGroup = self.attr("validate-group");

        var msg = "";
        //必填验证
        if (required != undefined && isEmpty(getValue(self))) {
            msg = getMsg(self, "required", defaultMsg.requiredMsg);
        } else if (maxLength != undefined && getValue(self).length > parseInt(maxLength)) {
            msg = getMsg(self, "validate-maxLength", defaultMsg.maxLengthMsg.format(maxLength));
        } else if (minLength != undefined && getValue(self).length < parseInt(minLength)) {
            msg = getMsg(self, "validate-minLength", defaultMsg.minLengthMsg.format(minLength));
        } else if (isCheckEmail != undefined && !checkReg(self, regExp.email)) {
            msg = getMsg(self, "validate-isEmail", defaultMsg.emailMsg);
        } else if (isCheckPhone != undefined && !checkReg(self, regExp.phone)) {
            msg = getMsg(self, "validate-isPhone", defaultMsg.phoneMsg);
        } else if (isCheckNumber != undefined && !checkReg(self, regExp.number)) {
            msg = getMsg(self, "validate-isNumber", defaultMsg.numberMsg);
        } else if (isCheckTel != undefined && !checkReg(self, regExp.number)) {
            msg = getMsg(self, "validate-isTel", defaultMsg.telMsg);
        } else if (regText != undefined && !checkReg(self, regText)) {
            msg = getMsg(self, "validate-reg", defaultMsg.regMsg);
        } else if (validateGroup != undefined && !validateGroupImpl(self, validateGroup,$inputs)) {
            msg = getMsg(self, "validate-group", defaultMsg.regMsg);
        }

        showTipMsg(self, msg);//弹出验证信息tips
    };

    var regExp = {
        email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
        number: /^[0-9]*$/,
        tel: /^(\d3,4|\d{3,4}-)?\d{7,8}$/,
        phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    };

    //比较验证
    var validateGroupImpl = function (self, group,$inputs) {

        var groupInputs = $inputs.filter("[validate-group='{0}']".format(group));

        //大小验证
        var bigger = groupInputs.filter("[bigger]").val();
        var smaller = groupInputs.filter("[smaller]").val();
        if (!isEmpty(bigger) && !isEmpty(smaller)) {
            if (bigger <= smaller) {
                return false;
            }
        }

        return true;
    };

    //验证正则表达式
    var checkReg = function (self, reg) {
        var val = getValue(self);
        var pattern = new RegExp(reg);
        return pattern.test(val);
    };

    //判断是否为空
    var isEmpty = function (val) {
        if (val == "" || val == undefined || val == null) {
            return true;
        } else {
            return false;
        }
    };

    //获取标签value
    var getValue = function (self) {
        var retval = "";
        var tagName = self.get(0).tagName.toLowerCase();
        if (tagName == "input" || tagName == "textarea") {
            retval = $.trim(self.val());
        }
        if (tagName == "select") {
            retval = $.trim(self.find("option:selected").val());
        }
        return retval;
    };

    //获取标签的错误提示语
    var getMsg = function (self, attr, defaultValue) {
        var attr = attr + "-msg";
        var msg = self.attr(attr);
        if (!msg) {
            msg = self.attr("validate-msg");
            if (!msg) {
                msg = defaultValue;
            }
        }
        return msg;
    };

    /*
     String format
     */
    String.prototype.format = String.prototype.f = function () {

        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    (function ($) {
        //是否绑定?
        if (!$.fn.simpleValidate) {
            //全局函数
            $.fn.simpleValidate = function () {
                require("./css/simpleValidate.css");
                return new SimpleValidate(this);
            };
        }
        ;
    })(jQuery);


});