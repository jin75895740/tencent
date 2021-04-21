$("#vip").hover(function () {
    // 获取QQ靓号本身的位置
    var x = $(this).offset().left - $("#vipMenu").width() + $("#vip").width() - 10;
    var y = $(this).offset().top + $("#vip").height() - 5;
    $("#vipMenu").css({"left": x, "top": y}).show();
},function() {
    isHide();
});
$("#vipMenu").hover(function(){
    $("#vipMenu").show();
},function() {
    isHide();
});
function isHide() {
    if(!$("#vipTxt").is(":focus")) {
        $("#vipMenu").hide();
    }
}
$("html").click(function(e){
    // 找到有没有一个id叫vipMenu的祖先
    var tag = $(e.target).parents("#vipMenu");
    // 把这个祖先的id取出来比较
    if(tag[0] && tag[0].id == "vipMenu") return;
    $("#vipMenu").hide();
});


$("#read").click(function(){
    // 自动判断是否有这个class,有就删除，没有就添加
    $(this).toggleClass("uncheck");
    $(this).toggleClass("checked");
});


$(window).resize(function(){
    if($(document).width() < 1024) {
        $("#left").addClass("small");
    } else {
        $("#left").removeClass("small");
    }
    if($(document).width() < 900) {
        $("#left").hide();
    } else {
        $("#left").show();
    }
});


$("#faceImg").click(function(){
    $("#face").click();
});

$("#face").change(function(){
    var thisFile = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(thisFile); /*异步解析，不会立马返回结果*/
    reader.onload = function(e) {
        var data = e.target.result;
        $("#faceImg").addClass("faceImg");
        $("#faceImg").attr("src", data);
    }
});
