$(function(){
    var menu = {
        opne : function(){
            $(".private-message").find(".opne").css({
                "transform":"rotate(45deg)",
                "-webkit-transform":"rotate(45deg)",
                "backgroundColor" : "#959595"
            });
            $(".private-message").find(".menu").css("height",180);
            $(".private-message").find(".wenzi").css("opacity",1);
            $("<div class='menu-layer'></div>").appendTo("body").css({
                width:$("body").width(),
                height:$("body").height(),
                opacity : 0.7
            });
        },
        close : function(){
            $(".private-message").find(".opne").css({
                "transform":"rotate(0deg)",
                "-webkit-transform":"rotate(0deg)",
                "backgroundColor" : "#ff0000"
            });
            $(".private-message").find(".menu").css("height",0);
            $(".private-message").find(".wenzi").css("opacity",0);
            $(".menu-layer").css("opacity",0);
            setTimeout(function(){
                $(".menu-layer").remove();
            },500);
        }
    };

    var socket = {
        app : "app",
        socket : io(),
        onMessage : function(user){
            this.socket.on(this.app+'message',function(data){
                var message = $("#message").clone(true);

                //user 自己的信息  data 是其它人的信息
                if(user.id == data.id){
                    message.find(".name").addClass("me");
                    message.find(".name").text("我");
                    message.find(".operate").find("i").hide();
                }else{
                    //其它人看到管理员
                    if(data.type == "1"){
                        message.find(".name").addClass("admin");
                        message.addClass("session-layer");
                    }else{
                        message.find(".operate").find("i").hide();
                    }
                    if(user.type == "1"){
                        message.addClass("session-layer");
                        message.find(".operate").find("i").show();
                    }

                    message.find(".name").text(data.name);

                }

                message.removeAttr("id").show().attr("data-user",JSON.stringify(data));
                message.find(".cont").text(data.content);
                message.find(".tx").attr("src",data.portrait);
                message.find(".time").text(getTime());
                message.appendTo($("#publicContent"));

                //聊天内容滚动到底部
                $("#publicContent").scrollTop($("#publicContent")[0].scrollHeight);
            });
        },
        onPrivateMessage : function(user){
            this.socket.on(this.app+'to'+user.id, function (data) {
                var message = $("#message").clone(true);
                if(data.type == "1"){
                    message.find(".name").addClass("admin");
                    message.find(".operate").find("i").hide();
                }else{
                    message.addClass("session-layer-p");
                }
                message.find(".name").text(data.name+" 对你说");
                message.find(".cont").text(data.content);
                message.find(".tx").attr("src",data.portrait);
                message.find(".time").text(getTime());

                message.removeAttr("id").show().attr("data-user",JSON.stringify(data));
                message.appendTo($("#privateContent"));
                $.toast("您有一条私信");
                if(!$(".menu-layer").length){
                    menu.opne();
                }
                $(".private-message").find(".sl").find("i").css({
                    "animation" : "shake 1s ease 1s",
                    "-webkit-animation" : "shake 1s ease 1s"
                });
                //聊天内容滚动到底部
                $("#privateContent").scrollTop($("#privateContent")[0].scrollHeight);
            });
            this.socket.on(this.app+'from'+user.id, function (data) {
                var message = $("#message").clone(true);
                message.find(".name").addClass("me");
                message.find(".name").text("我对 "+data.name+" 说");
                message.find(".operate").find("i").hide();
                message.find(".cont").text(data.content);
                message.find(".time").text(getTime());
                message.removeAttr("id").show().attr("data-user",JSON.stringify(data));
                message.appendTo($("#privateContent"));
                $(".private-message").show();
                //聊天内容滚动到底部
                $("#privateContent").scrollTop($("#privateContent")[0].scrollHeight);
            })
        },
        onBlacklist : function(user){
            this.socket.on(this.app+'blacklist', function (data){
                if(user.id == data.id){
                    $(".say-input").attr("disabled","disabled").attr("placeholder","您已被禁言");
                    $(".say-submit").unbind();
                }
                $.each($(".other-say"),function(i,n){
                    if($(n).css("display") == "block"){
                        var userData = JSON.parse($(n).attr("data-user"));
                        if(userData.id == data.id){
                            $(n).remove();
                        }
                    }
                })
            })
        },
        onComeIn : function(){
            this.socket.on(this.app+'come in', function (user){

                sysMes("<span>欢迎 "+user.name+" 尊驾光临，有问题问美女，没问题聊美女</span>");

                //聊天内容滚动到底部
                $("#publicContent").scrollTop($("#publicContent")[0].scrollHeight);
            })
        },
        onExit: function(){
            this.socket.on(this.app+'exit', function (name) {
                sysMes("<span> " + name + "已退出聊天室</span>");

                //聊天内容滚动到底部
                $("#publicContent").scrollTop($("#publicContent")[0].scrollHeight);
            })
        },
        emitPrivateMessage : function(from,to,msg){
            from.content = msg;
            to.content = msg;
            this.socket.emit(this.app+'private message',from,to);
        },
        emitMessage : function(user,content){
            user.content = content;
            this.socket.emit(this.app+'message',user);
        },
        emitBlacklist : function(user){
            this.socket.emit(this.app+'blacklist',user)
        },
        emitComeIn : function(user){
            this.socket.emit(this.app+'come in',user);
        },
        emitApp : function(item){
            this.app = item;
            this.socket.emit('app',item);
        }
    };
    //用户信息
    var user = JSON.parse($("#user").val());
    socket.emitApp("live");
    socket.onMessage(user);
    socket.onPrivateMessage(user);
    socket.onBlacklist(user);
    socket.onComeIn();
    //socket.onExit();
    socket.emitComeIn(user);


    //发送消息按键事件
    $("#publicSay").find(".say-submit").on("click",sendContent);
    $("body").keyup(function (e) {
        if (e.which == 13){
            if($(".popup-private-chat").css("display") == "none"){
                $("#publicSay").find(".say-submit").trigger("click");
            }else{
                $("#privateSay").find(".say-submit").trigger("click");
            }

        }
    });

    //发送私聊消息按键事件
    $("#privateSay").find(".say-submit").on("click",sendContent);


    $(".private-message").find(".sl").on("click",function(){
        menu.close();
        $.popup(".popup-private-chat");
    });
    //私聊
    $(".siliao").on("click",function(){
        $.popup(".popup-private-chat");

    });

    $(".opne").on("click",function(){
        if($(".menu-layer").length){
            menu.close();
        }else{
            menu.opne();
        }


    });



    //点击私聊按键事件
    $(document).on("click",".session-layer",function(){
        sessionLayer(this,"#publicSay");
    });

    //回复按键事件
    $(document).on("click",".session-layer-p",function(){
        sessionLayer(this,"#privateSay");
    });

    $(document).on("click",".popup-overlay",function(){
        $.closeModal(".popup-private-chat");
    });

    //邀请
    $(".yaoqing").on("click",function(){
        $("<div class='yaoqing-box'><div class='yaoqing-layer'></div><div  class='yaoqing-layer-img'><img src='/phone/images/share.png'><div class='yaoqing-layer-font'>请点击右上角,<br>邀请朋友加入，丰厚大礼等着你</div></div></div>").appendTo("body");
        $(".yaoqing-layer").css({
            width : $("body").width(),
            height : $("body").height()
        })
    });
    $(document).on("click",".yaoqing-box",function(){
        $(this).remove();
    })

    if(user.blacklist == 1){
        $(".say-input").attr("disabled","disabled").attr("placeholder","您已被禁言");
        $(".say-submit").unbind();
    }


    setMessageHeight();

    scrollLeft(".announcement");

    //验证游客身份
    authenticate();

    function sessionLayer(t,obj){
        var text = "私聊";
        if(obj == "#privateSay"){
            text = "回复";
        }
        var messageUser = JSON.parse($(t).attr("data-user"));
        var buttons = [
            {
                text: text
            },
            {
                text: '取消',
                close: true
            }
        ];
        //当自己是管理员
        if(user.type == "1"){
            buttons = [
                {
                    text: text
                },
                {
                    text: '禁言',
                    onClick: function() {
                        $.ajax({
                            url : "/live",
                            type : "post",
                            dataType : "json",
                            data:{
                                id : messageUser.id
                            },
                            beforeSend : function(XMLHttpRequest){
                                $.showIndicator();
                            },
                            success : function(data){
                                if(data.core == "1"){
                                    socket.emitBlacklist(messageUser);
                                }
                                $.hideIndicator()
                            }
                        })
                    }
                },
                {
                    text: '取消',
                    close: true
                }
            ];
        }

        buttons[0].onClick = function(){
            $(obj).find(".say-input").val("@"+messageUser.name+"：").focus();
            $(obj).find(".say-submit").attr("data-to",JSON.stringify(messageUser));
        };
        $.modal({
            title:  '操作',
            verticalButtons: true,
            extraClass: "modal-style",
            buttons:buttons
        })
    }

    //内容发送
    function sendContent(){
        var sayInput = $(this).parents(".say").find(".say-input");
        var content = sayInput.val();
        var filter = filter($("#filter").val()); //过滤内容
        if(content == ""){
            $.toast("内容不能为空！");
        }else{
            for(var i=0;i<filter.length;i++){
                content = content.replace(filter[i],"***");
            }
            if($(this).attr("data-to") == null){
                socket.emitMessage(user,content);
            }else{
                var to = JSON.parse($(this).data("to"));

                if(user.id == to.id){
                    $.toast("请选择回复对象！");
                }else{
                    socket.emitPrivateMessage(user,to,content);
                }
            }
            $("#publicSay").find(".say-submit").removeAttr("data-to");
            sayInput.val("");
        }

        //过滤内容
        function filter(cont){
            var contArr = cont.split("，");
            return contArr;
        }
    }


    //格式化当前时间
    function getTime(){
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        if(hours < 10){
            hours = "0"+hours;
        }
        if(minutes <10){
            minutes = "0"+minutes;
        }
        if(seconds <10){
            seconds = "0"+seconds;
        }
        return hours+ ":" + minutes+":"+seconds;
    }

    function sysMes(content){
        var sysMes = $("#sysMes").clone(true);
        sysMes.removeAttr("id").show().html(content);
        sysMes.appendTo($("#publicContent"));
    }

    function setMessageHeight(){
        var publicContent = parseInt(($("body").height()/2) - 40);
        $("#publicContent").css("height",publicContent);
    }

    function scrollLeft(obj){
        var width = $("body").width();
        $(obj).css({
            "transition-duration" : "20s",
            "-webkit-transition" : "20s",
            "left":width
        });
    }

    function askAdmin(data){
        var message = $("#message").clone(true);
        message.find(".name").addClass("admin");
        message.find(".name").text(data.name+" 对你说");
        message.find(".operate").find("i").hide();
        message.find(".cont").text(data.content);
        message.find(".tx").attr("src",data.portrait);
        message.find(".time").text(getTime());
        message.find(".operate").find("i").show();
        message.addClass("session-layer-p");
        message.removeAttr("id").show().attr("data-user",JSON.stringify(data));
        message.appendTo($("#privateContent"));
    }

    //验证游客身份
    function authenticate(){
        var time = 180000;  //3分钟
        if(user.phone == "10000000000"){
            $("#tabMenu").unbind();
            $(".icon-caret").remove();
            $(".opne").hide();
            $(".status-item").hide();
            $(".say-submit").unbind().on("click",function(){
                render();
            });
            setTimeout(render,time);
        };


        function render(){
            var text = "您的权限不足，请先进行注册！";
            $.alert(text, function(){
                window.location.href = "/login";
            });
        }
    }

});


