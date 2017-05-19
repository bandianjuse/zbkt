$(function(){
    var cp = new Components(); //组件

    var phone = $("#phone");
    var codePhone = $("#codePhone");
    var password = $("#password");
    var againPassword = $("#againPassword");
    var code = MathRand();

    $("#code").on("click",function(){
        var againCode = MathRand();
        code = againCode;
        if(!isPhone(phone)) return;
        countdown("#code")

        sendSMS(code,phone.val());
    });


    $("#submit").on("click",function(){
        if(!isPhone(phone)) return;
        if(codePhone.val() == ""){
            cp.alert({
                content : "请输入手机验证码！"
            });
            codePhone.focus();
            return;
        }
        if(password.val() == ""){
            cp.alert({
                content : "密码不能为空！"
            });
            password.focus();
            return;
        }
        if(againPassword.val() == ""){
            cp.alert({
                content : "密码确认不能为空！"
            });
            phone.focus();
            return;
        }
        if(password.val() != againPassword.val()){
            cp.alert({
                content : "两次密码不一致！"
            });
            return;
        }


        if(code != codePhone.val()){
            cp.alert({
                content : "验证码错误！"
            });
            return;
        }

        var data = {
            phone : phone.val(),
            password : password.val()
        };
        register(data);
    });

    function isPhone(phone){
        var RegCellPhone = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;

        if(phone.val() == ""){
            cp.alert({
                content : "手机号码没有填写！"
            });
            phone.focus();
            return false;
        }
        if(!RegCellPhone.test(phone.val())){
            cp.alert({
                content : "请输入正确的手机格式！"
            });
            phone.focus();
            return false;
        }
        return true;
    }

    function countdown(id){
        var i = 59;
        var clear = setTimeout(count,1000);
        $(id).attr("disabled",true);

        function count(){
            i--;
            $(id).text("重新获取 "+i+"s");
            var clear = setTimeout(count,1000);
            if(i == 0){
                $(id).attr("disabled",false);
                $(id).text("验证码获取") ;
                clearTimeout(clear)
            }

        }
    }


    //随机6位数字验证码
    function MathRand() {
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }

    //发送验证码
    function sendSMS(code,phone){
        var username = "szsyd";
        var password_md5 = "4e348b7f9a7dd9f72bf40f5ad366b2e2";
        var apikey = "bbc64e817627e35089fe12d85391f9b2";
        var mobile = phone;
        var content = "您正在注册大数据平台用户管理系统，验证码 ："+code+"，请您在5分钟内完成验证，勿将验证码泄露给他人。";
        var url = 'http://m.5c.com.cn/api/send/index.php?username='+username+'&password_md5='+password_md5+'&apikey='+apikey+'&mobile='+mobile+'&content='+content+'&encode=utf8';
        $.ajax({
            url : url,
            type : "get",
            dataType : "jsonp",
            success : function(data){
                console.log(data);
            }
        })
    }

    //发送验证码
    function register(data){
        $.ajax({
            url : "/register/",
            type : "post",
            dataType : "json",
            data:data,
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 0){
                    alert("注册成功！")
                    window.location.href = "http://www.mayiweiketang.com:3000/main.html";
                }else if(data.core === 1){

                    alert("注册失败！此手机已经注册过，请换个手机号码试试！");
                    window.location.href = "http://www.mayiweiketang.com/register/";
                }else{
                    cp.alert({
                        content : "注册失败！"
                    });
                }
            }
        })
    }
});
