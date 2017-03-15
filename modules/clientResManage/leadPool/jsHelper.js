/**
 * Created by Moment on 2015/8/24.
 */

isNullOrEmpty=function(obj) {
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
};

Array.prototype.indexOf = function(value){
    for (var i=0,n=this.length; i<n; i++){
        if (this[i] === value){
            return i;
        }
    }
    return -1;
};

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
