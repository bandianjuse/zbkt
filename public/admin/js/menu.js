$(function(){
    var index = $("html").attr("menu");
    $("#menu").find("li").eq(index).find("a").addClass("active").find("i").show().end().siblings().find("a").removeClass("active").find("i").hide();
});
