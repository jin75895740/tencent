//桌面logo单击触发事件
$("#desktop li").click(function(){
    // 清除之前的
    $("#desktop li").removeClass("choose");
    // 在给当前点击的这个添加
    $(this).addClass("choose");
});
// 点击桌面，取消选中
$("html").click(function(e){
    if(e.target.tagName == "HTML") {
        $("#desktop li").removeClass("choose");
    }
});

$("#box>span").click(function(){
    $(this).toggleClass("checked");
});

var win = document.getElementById("tencent");
var x,y;
win.ondragstart = function(e) {
    x = e.offsetX;
    y = e.offsetY;
}
win.ondrag = function(e) {
    if($("#username").is(":focus")) return;
    if(e.pageX == 0 && e.pageY == 0) return;
    win.style.left = e.pageX - x + "px";
    win.style.top = e.pageY - y + "px";
}

$("#username").on("input propertychange", function(){
    var url = "/face?username=" + this.value;
    $("#face").attr("src", url);
});
$("#face").on("error", function(){
    $(this).attr("src", "/images/default_face.png");
});
// 点击最小化
$("#small").click(function(){
    // 给QQ登录窗口添加最小化动画
    $("#tencent").addClass("small");
    // 显示任务栏QQ小图标
    $("#qq_task").show();
});
// 双击id为qq的桌面图标，显示Tencent主界面
$("#qq").dblclick(function(){
    $("#tencent").fadeIn(300);
});
// 点击任务栏的小图标QQ，删除最小化的动画达到还原主窗口。
$("#qq_task").click(function(){
    $("#tencent").removeClass("small");
    $(this).hide();// 隐藏自己任务栏的小图标
});
// 如果有dialog提示框，就要默认显示主窗口
var dialog = document.getElementById("dialog");
if(dialog) {
    var url = "/face?username=" + $("#username").val();
    $("#face").attr("src", url);
    $("#tencent").show();
}