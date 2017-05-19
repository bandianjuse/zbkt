$(function(){
    var cp = new Components(); //组件
    var index = sessionStorage.getItem("sysTab");
    selectDef(".type");
    selectDef("#setAdmin");
    selectDef("#kfAdmin");
    tabCont(index);

    $(".editSubmit").on("click",function(){
        var data = {};
        if($(this).hasClass("basis")){
            var value = {};
            data.item = "basis";
            value = {
                siteTitle : $("#siteTitle").val(),
                siteKeywords : $("#siteKeywords").val(),
                siteDescription : $("#siteDescription").val()
            };
        }else if($(this).hasClass("time")){
            var value = [];
            data.item = "time";
            $.each($(".tcont"),function(i,n){
                value.push({
                    type : $(n).find(".type").val(),
                    start : $(n).find(".start").val(),
                    end : $(n).find(".end").val()
                })
            });
        }else if($(this).hasClass("live")){
            var value = {};
            data.item = "live";
            value = {
                activityId : $("#activityId").val(),
                admin : $("#setAdmin").val(),
                filter : $("#filter").val(),
                announcement : $("#announcement").val(),
            }
        }else if($(this).hasClass("consulting")){
            var value = {};
            data.item = "consulting";
            value = {
                activityId : $("#kfActivityId").val(),
                admin : $("#kfAdmin").val(),
                filter : $("#kfFilter").val(),
                online : $("#online").val(),
            }
        }

        data.value = JSON.stringify(value);

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
            url : "/admin/system",
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

    function selectDef(obj){
        $.each($(obj),function(i,n){
            $(n).val($(n).attr("data-value"))
        });

    }
});



