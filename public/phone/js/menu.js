$(function(){
    $("#tabMenu").on("click",function(){
        if($(".menu-one").css("display") == "none"){
            $(".menu-one").show();
            $(".menu-two").hide();
            $(".icon-caret").css({
                "transform" : "rotate(0deg)",
                "-webkit-transform" : "rotate(0deg)"
            })
        }else{
            $(".menu-one").hide();
            $(".menu-two").show();
            $(".icon-caret").css({
                "transform" : "rotate(180deg)",
                "-webkit-transform" : "rotate(180deg)"
            })
        }
    });

    $(document).on("open", ".panel", function() {
        $(".live-video").css("left","240px");
    });

    $(document).on("close", ".panel", function() {
        $(".live-video").css("left","0");
    });
});
