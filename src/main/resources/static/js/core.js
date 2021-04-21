function getParamter(searchKey) {
    var loc = window.location.toString(); // 获取url
    var pos = loc.indexOf("?"); // 找到url中?的位置
    if(pos == -1) return null; // -1代表没有？，也就代表没有传数据过来
    var paramters = loc.substring(pos + 1); // 截取？号后面所有的内容
    var values = paramters.split("&");
    for(var index in values) {
        var val = values[index];
        var eqPos = val.indexOf("=");
        var key = val.substring(0, eqPos);
        var value = val.substring(eqPos + 1);
        if(searchKey == key) {
            return value;
        }
    }
}