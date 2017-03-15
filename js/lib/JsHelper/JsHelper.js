/**
 * Created by Moment on 2015/8/3.
 */

//字符串格式化
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

// 返回字符的长度，一个中文算2个
String.prototype.ChineseLength = function () {
    return this.replace(/[^\x00-\xff]/g, "**").length;
};

// 判断字符串是否以指定的字符串结束
String.prototype.EndsWith = function (A, B) {
    var C = this.length;
    var D = A.length;
    if (D > C)return false;
    if (B) {
        var E = new RegExp(A + '$', 'i');
        return E.test(this);
    } else return (D == 0 || this.substr(C - D, D) == A);
};

// 判断字符串是否以指定的字符串开始
String.prototype.StartsWith = function (str) {
    return this.substr(0, str.length) == str;
};

// 字符串从哪开始多长字符去掉
String.prototype.Remove = function (A, B) {
    var s = '';
    if (A > 0)s = this.substring(0, A);
    if (A + B < this.length)s += this.substring(A + B, this.length);
    return s;
};

//去掉字符串左边的空格
String.prototype.ltrim = function () {
    return this.replace(/^\s*/, "");
}

//去除字符串右边的空格;
String.prototype.rtrim = function () {
    return this.replace(/\s*$/, "");
}

//去除字符串左右的空格;
String.prototype.trim = function () {
    return (this.rtrim()).ltrim();
}

//判断密码安全级别
String.prototype.checkPassWordLevel = function () {
    var n = 0;
    if (/\d/.test(this)) n++; //包含数字
    if (/[a-z]/.test(this)) n++; //包含小写字母
    if (/[A-Z]/.test(this)) n++; //包含大写字母
    if (this.length == 6) n = 1; //长度小于6位
    return n;
}

//判断密码安全级别2 按长度
String.prototype.checkPassWordLevel1 = function () {
    var grade = 0;
    if (this.length >= 6 && this.length <= 9) {
        grade = 1;
    }
    if (this.length >= 10 && this.length <= 15) {
        grade = 2;
    }
    if (this.length >= 16 && this.length <= 20) {
        grade = 3;
    }

    return grade;
};

var getUrlParameter = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
};

/*	字符串替换  */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

function isNullOrEmpty(obj) {
    if (obj == undefined || obj == null || obj == "") {
        return true;
    }
    else {
        return false;
    }
};

//处理空字段 为null 和 undefined 情况
function formatNullField(obj) {
    if (obj == undefined || obj == null) {
        return "";
    }
    else {
        return obj;
    }
}

//定义日期格式化方法
Date.prototype.format = function (format) {
    var o =
    {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //cond
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd hh:mm";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}

function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}