$(function(){
    var cp = new Components(); //组件
    var index = sessionStorage.getItem("sysTab");

    tabCont(index);

    var editorAbout = new Simditor({
        textarea: $('#about')
        //optional options
    });
    var editorStatement = new Simditor({
        textarea: $('#statement')
        //optional options
    });
    var editorServicet = new Simditor({
        textarea: $('#service')
        //optional options
    });

    $(".editSubmit").on("click",function(){
        var data = {};
        if($(this).hasClass("about")){
            data = {
                title : "关于我们",
                content :  $("#about").val()
            }
        }else if($(this).hasClass("statement")){
            data = {
                title : "免责声明",
                content :  $("#statement").val()
            }
        }else if($(this).hasClass("service")){
            data = {
                title : "服务中心",
                content :  $("#service").val()
            }
        }
        updateData(data);
    });

    $(".set-btn").on("click",function(){
        var index = $(this).index();
        tabCont(index);
    });

    $(document).on("click",".tadd",function(){
        var tcont = $(".tcont").eq(0).clone(true);
        $(this).parents(".tcont").after(tcont);
    });
    $(document).on("click",".tdel",function(){
        if($(".tcont").length !== 1){
            $(this).parents(".tcont").remove();
        }
    });

    function updateData(data){
        $.ajax({
            url : "/admin/page",
            type : "post",
            dataType : "json",
            data:data,
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    cp.alert({
                        content : "修改成功！",
                        type : "alert-success"
                    });
                }
            }
        })
    }

    function tabCont(index){
        sessionStorage.setItem("sysTab",index);
        $(".set-btn").eq(index).addClass("btn-primary").removeClass("btn-secondary").siblings().addClass("btn-secondary").removeClass("btn-primary")
        $(".set-cont").eq(index).addClass("active").siblings().removeClass("active");
    }

});

