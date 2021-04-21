var username = $("#username").val();
// window.location.host代表获取ip:port
var url = "ws://" + window.location.host + "/chat?username=" + username;
// 与后台建立websocket长连接
var ws = new WebSocket(url);
ws.onopen = function(){}
// 当后台发送数据给前台，会执行的函数
ws.onmessage = function(e) {
    var message = JSON.parse(e.data);
    // 当没有type的时候，意味着传了用户列表来
    if(!message.type) {
        onlineUser(message);
    } else if(message.type == 1) {
        // 系统上/下线消息
        systemOnlineMessage(message);
    } else if(message.type == 4) {
        // 用户文本消息
        userTextMessage(message);
    } else if(message.type == 5) {
        // 收到用户抖动消息
        dydMessage(message);
    } else if(message.type == 6) {
        // 收到用户撤回消息
        backupMessage(message);
    }
    // 滚动条滑到最底部
    $("#record").scrollTop(9999999);
}
function systemOnlineMessage(message) {
    var str = new Array();
    str.push("<div class='system_online'>")
    str.push("------");
    str.push(message.username + ":" + message.content);
    str.push("------");
    str.push("</div>")
    $("#record").append(str.join(""));
}
function onlineUser(usernames) {
    // 每次有上线的，清空之前的列表，更新现在所有的列表
    $("#online_people").empty();
    var str = new Array();
    // 遍历每一个用户，生成字符串的html代码，然后动态插入到ul中去
    for(var i = 0; i < usernames.length; i++) {
        str.push("<li>");
        str.push("<span>");
        str.push("<img src='/face?username=" +usernames[i]+ "'>");
        str.push("</span>");
        str.push("<span>");str.push(usernames[i]);str.push("</span>");
        str.push("</li>");
    }
    $("#online_people").append(str.join(""));
}
function userTextMessage(message) {
    var str = new Array();
    str.push("<div>");
    str.push("<img src='/face?username="+message.username+"' class='chatFace'>");
    str.push("<div class='float_left'>");
    str.push("<span>"+message.username+"</span>");
    str.push("<span messageId='"+message.messageId+"' class='text'>"+message.content+"</span>");
    str.push("</div>");
    str.push("<div style='clear:both;'></div>");
    str.push("</div>");
    $("#record").append(str.join(""));
}
function dydMessage(message) {
    var str = new Array();
    str.push("<div class='dyd'>")
    str.push(message.username + ":" + message.content);
    str.push("</div>")
    $("#record").append(str.join(""));
    // 执行动画，让窗口hi起来
    // 获取窗口当前位置
    var left = $("#win").offset().left;
    var top = $("#win").offset().top;
    for(var i = 0; i < 10; i++) {
        // 随机一个1到10的整数
        var leftNumber = parseInt(Math.random() * 10) + 1;
        var topNumber = parseInt(Math.random() * 10) + 1;
        var flag = parseInt(Math.random() * 10) + 1;
        if(flag % 2 == 0) {
            $("#win").animate({"left":left + leftNumber + "px"},10);
            $("#win").animate({"top":top + topNumber + "px"},10);
        } else {
            $("#win").animate({"left":left - leftNumber + "px"},10);
            $("#win").animate({"top":top - topNumber + "px"},10);
        }
    }
    $("#win").animate({"left":left + "px"},10);
    $("#win").animate({"top":top + "px"},10);

}
function backupMessage(message) {
    var thisMessage = $("#record .text")
        .filter("[messageId='"+message.messageId+"']");
    thisMessage.parent().parent()
        .replaceWith("<div class='backup'>"+message.content+"</div>");

}
$("#sendBtn").click(function(){
    var value = $("#textInput").html();
    ws.send(value);
    $("#textInput").empty();  // 清空
    $("#textInput").focus();  // 聚焦
});
/*表情包*/
$("#textInput").emoji({
    button:"#emojiBtn",
    showTab: true,
    animation: "fade",
    icons: [{
        name: "QQ表情",
        path: "/emoji/dist/img/qq/",
        maxNum: 92,
        file: ".gif"
    },{
        name: "贴吧表情",
        path: "/emoji/dist/img/tieba/",
        maxNum: 50,
        file: ".jpg"
    }]
});
// 抖一抖功能
$("#dyd").click(function(){
    // 如果有这个值
    var val = $("#dydValue").val();
    if(val) {
        ws.send("\0");
        $("#dydValue").val(""); // 清空后没有1这个数据了
        setTimeout(function(){  // 设置一个定时器，过10S中后执行function函数
            $("#dydValue").val("1");
        },10000);
    } else {
        $("#warning").show();
        $("#warning").fadeOut(2000);
    }
});
// 发送图片功能
$("#imgBtn").click(function(){
    $("#file").click();
});
// 选择完图片会触发change事件
$("#file").change(function(){
    var files = this.files; // 取到用户选择的所有的文件
    for(var i = 0; i < files.length; i++) { // 遍历这些文件
        var reader = new FileReader();
        reader.readAsDataURL(files[i]); // 读取当前这一张图片
        reader.onload = function(e){ // 读完了会走这个function函数
            var img = document.createElement("img"); // 创建一个img标签
            img.src = e.target.result; // 把读出来的结果放到img中
            img.className = "imgData";
            $("#textInput").append(img);// 把img加到输入框里面去
        }
    }
});

// 取消默认的右键菜单
document.oncontextmenu = function() {
    return false;
}
$("#record").on("mousedown", ".text", function(e){
    // 获取登陆者的用户名
    var username = $("#username").val();
    // 获取消息的发送者
    var messageUsername = $(this).prev().html();
    if(e.which == 3 && username == messageUsername) {
        // 点右键弹出菜单的时候，把messageId获取到，存到一个地方
        var messageId = $(this).attr("messageId");
        $("#messageId").val(messageId);
        $("#backup").css({"left" : e.pageX, "top" : e.pageY}).show();
    }
});

$("#backup").click(function(){
    var messageId = $("#messageId").val();
    // 以暗号+id发送给后台，后台收到通知所有客户端页面删除这条消息
    ws.send("\1" + messageId);
    $(this).hide();
});
// 点击其他地方隐藏撤回菜单
$(document).click(function(e){
    if(e.target.id != "backup") {
        $("#backup").hide();
    }
});