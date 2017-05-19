$(function(){
    var cp = new Components(); //组件

    $("body").keyup(function (e) {
        if (e.which == 13){
            $("#login").trigger("click");
        }
    });

    $("#login").on("click",function(){
        var inputName = $("#inputName");
        var inputPassword = $("#inputPassword");
        var data = {
            name : inputName.val(),
            password : inputPassword.val()
        };

        if(inputName.val() === ""){
            inputName.focus();
            cp.alert({
                content : "用户名不能为空！"
            });
            return false;
        }
        if(inputPassword.val() === ""){
            inputPassword.focus();
            cp.alert({
                content : "密码不能为空！"
            });
            return false;
        }
        validation(data);

    });

    function validation(data){
        $.ajax({
            url : "/admin/",
            type : "post",
            dataType : "json",
            data:data,
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 0){
                    window.location.href = "/admin/system";
                }else if(data.core === -1){
                    cp.alert({
                        content : "密码错误！"
                    });
                }else if(data.core === -2){
                    cp.alert({
                        content : "该用户不存在！"
                    });
                }
            }
        })
    }
});


