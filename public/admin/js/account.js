$(function(){
    var cp = new Components(); //组件
    var userPage = new Page("#userPage");
    var adminPage = new Page("#adminPage");
    var uPage = sessionStorage.getItem("uPage");
    var aPage = sessionStorage.getItem("aPage");
    var navActive = sessionStorage.getItem("navActive");
    if(uPage == null || uPage == "null") uPage = 1;
    getData(uPage,1,1);

    if(aPage == null || aPage == "null") aPage = 1;
    getData(aPage,2,1);

    $(".nav-link").removeClass("active").eq(navActive).addClass("active");
    $(".tab-pane").removeClass("active in").eq(navActive).addClass("active in");




    $("#searchUserSubmit").on("click",function(){
        var query = getSearchQuery();
        getData(uPage,1,query);
    });

    $("#searchAdminSubmit").on("click",function(){
        var query = 1;
        var name = $("#adminName").val();
        if(name != ""){
            query = {
                name : $("#adminName").val()
            };
        }

        getData(aPage,2,JSON.stringify(query));
    });


    $(document).on("click",".user-edit",function(){
        var id = $(this).data("id");
        getUserData(id);
    });

    $(document).on("click",".admin-edit",function(){
        var id = $(this).data("id");
        $("#adminEditModal").modal("show");
        $("#adminSubmit").attr("data-id",id);
    });
    $(document).on("click",".admin-del",function(){
        var id = $(this).data("id");
        cp.confirm({
            content : "您确认要删除吗？",
            onConfirm : function () {
                delAdmin(id);
            }
        })
    });

    $("#userSubmit").on("click",function(){
        var id = $(this).data("id");
        var blacklist = $("#blacklist").val();
        var type  = $("#type").val();
        updateUser(id,blacklist,type);
        getData(uPage,1,1);
    });
    $("#adminSubmit").on("click",function(){
        var id = $(this).data("id");
        var newPwd = $("#newPwd");
        var reNewPwd  = $("#reNewPwd");
        if(newPwd.val() == ""){
            cp.alert({
                content : "新密码不能为空！",
            });
            newPwd.focus();
            return;
        }
        if(reNewPwd.val() == ""){
            cp.alert({
                content : "新密码确认不能为空！",
            });
            reNewPwd.focus();
            return;
        }
        if(newPwd.val() != reNewPwd.val()){
            cp.alert({
                content : "密码不一致！",
            });
            reNewPwd.focus();
            return;
        }

        updateAdmin(id,newPwd.val());
        
    });

    $("#addSubmit").on("click",function(){
        var addName = $("#addName");
        var addPwd = $("#addPwd");
        var reAddPwd = $("#reAddPwd");
        if(addName.val() == ""){
            cp.alert({
                content : "账号不能为空！"
            });
            addName.focus();
            return;
        }
        if(addPwd.val() == ""){
            cp.alert({
                content : "密码不能为空！"
            });
            addPwd.focus();
            return;
        }
        if(reAddPwd.val() == ""){
            cp.alert({
                content : "确认密码不能为空！"
            });
            reAddPwd.focus();
            return;
        }
        if(reAddPwd.val() != addPwd.val()){
            cp.alert({
                content : "密码不一致！"
            });
            reAddPwd.focus();
            return;
        }
        var data = {
            name : addName.val(),
            password : addPwd.val()
        };
        addAdmin(data);
    });

    $(".nav-link").on("click",function(){
        var index = $(this).parent().index();
        sessionStorage.setItem("navActive",index);
    });

    function getSearchQuery(){
        var name = $("#name").val();
        var phone = $("#phone").val();
        var query = {};
        if(name == "" && phone != ""){
            query = {
                phone : phone
            };
        }else if(name != "" && phone == ""){
            query = {
                name : name,
            };
        }else if(name == "" && phone == ""){
            query = 1;
        }else{
            query = {
                name : name,
                phone : phone
            };
        }
        return JSON.stringify(query);
    }

    function getData(page,type,query){

        if(type == 1){
            sessionStorage.setItem("uPage",page);
        }else{
            sessionStorage.setItem("aPage",page);
        }
        $.ajax({
            url : "/admin/account",
            type : "post",
            dataType : "json",
            data:{
                page : page,
                query : query,
                type : type
            },
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    var content = data.data;
                    var htmlCont = "";
                    var tdArr = [];
                    $(".pager").show();
                    if(content.length){
                        $.each(content,function(i,n){
                            if(type == 1){
                                var htmlCont =
                                    '<tr>'+
                                    '<td><img class="tx" src="'+ n.portrait +'"></td>'+
                                    '<td style="max-width:150px; ">'+ n.name +'</td>'+
                                    '<td>'+ (n.phone == "10000000000" ? "" : n.phone) +'</td>'+
                                    '<td>'+ (n.email || "") +'</td>'+
                                    '<td>'+ (n.region || "") +'</td>'+
                                    '<td>'+ (n.blacklist ? "是" : "否") +'</td>'+
                                    '<td>'+ (n.type ? "管理员" : "普通用户") +'</td>'+
                                    '<td>'+ moment( n.createTime ).format("YYYY-MM-DD HH:mm:ss") +'</td>'+
                                    '<td><a href="javascript:" class="user-edit" data-id="'+n._id+'">编辑</a></td>' +
                                    '</tr>';
                            }else if(type == 2){
                                var htmlCont =
                                    '<tr>'+
                                    '<td>'+n.name+'</td>'+
                                    '<td>'+ moment( n.createTime ).format("YYYY-MM-DD HH:mm:ss") +'</td>'+
                                    '<td>' +
                                    '<a href="javascript:" class="admin-edit" style="margin-right:20px;" data-id="'+n._id+'">重置密码</a>  ' +
                                    '<a href="javascript:" class="admin-del"  data-id="'+n._id+'" >删除</a>' +
                                    '</td>'+
                                    '</tr>';

                            }
                            tdArr.push(htmlCont);
                        });

                        if(type == 1){
                            $("#userPage").find(".now-page").html(page).end().find(".total-page").html(data.total)
                        }else if(type == 2){
                            $("#adminPage").find(".now-page").html(page).end().find(".total-page").html(data.total)
                        }
                    }else{
                        if(type == 1){
                            var htmlCont = '<tr><td colspan="9" class="no-data text-center">没有查询到信息！</td></tr>';
                            tdArr.push(htmlCont);
                            $("#userPage").find(".pager").hide();

                        }else if(type == 2){
                            var htmlCont = '<tr><td colspan="3" class="no-data text-center">没有查询到信息！</td></tr>';
                            tdArr.push(htmlCont);
                            $("#adminPage").find(".pager").hide();
                        }
                    }

                    if(type == 1){
                        $("#userList").html(tdArr.join(""));
                        $("#userPage").attr("page",page).attr("total",data.total);


                        userPage.redirect({
                            nowPage : page,
                            totalPage : data.total
                        },function(page){
                            var query = getSearchQuery();
                            getData(page,1,query);
                        })
                    }else if(type == 2){
                        $("#adminList").html(tdArr.join(""));
                        $("#adminPage").attr("page",page).attr("total",data.total);


                        adminPage.redirect({
                            nowPage : page,
                            totalPage : data.total
                        },function(page){
                            var query = getSearchQuery();
                            getData(page,1,query);
                        })
                    }



                }else{
                    // htmlT = "您查询的用户不存在！";
                    // $("#resultsTable").hide();
                }

            }
        })
    }

    function getUserData(id){
        $.ajax({
            url : "/admin/account/"+id,
            type : "get",
            dataType : "json",
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    var user = data.data;
                    $("#userEditModal").modal("show");
                    $("#blacklist").val(user.blacklist);
                    $("#type").val(user.type);
                    $("#userSubmit").attr("data-id",user._id);
                }
            }
        })
    }

    function updateUser(id,blacklist,type){
        $.ajax({
            url : "/admin/updateuser",
            type : "post",
            dataType : "json",
            data : {
                id : id,
                blacklist :  blacklist,
                type : type
            },
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    cp.alert({
                        content : "编辑成功！",
                        type : "alert-success"
                    });
                    $("#userEditModal").modal('hide');
                }
            }
        })
    }

    function updateAdmin(id,pwd){
        $.ajax({
            url : "/admin/updateadmin",
            type : "post",
            dataType : "json",
            data : {
                id : id,
                password : pwd
            },
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
                    $("#adminEditModal").modal('hide');
                }
            }
        })
    }

    function delAdmin(id){
        $.ajax({
            url : "/admin/deladmin",
            type : "post",
            dataType : "json",
            data : {
                id : id
            },
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    cp.alert({
                        content : "删除成功！",
                        type : "alert-success"
                    });
                    getData(aPage,2,1);
                }
            }
        })
    }

    function addAdmin(data){
        $.ajax({
            url : "/admin/saveadmin",
            type : "post",
            dataType : "json",
            data : data,
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    cp.alert({
                        content : "添加成功！",
                        type : "alert-success"
                    });
                    $("#addAdminModal").modal("hide");
                    getData(aPage,2,1);
                }
                if(data.core === 0){
                    cp.alert({
                        content : "添加的账号已存在！",
                    });

                }

            }
        })
    }

});

