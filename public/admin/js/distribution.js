$(function(){
    var cp = new Components(); //组件
    var fxPage = new Page("#fxPage");//分页

    $("#searchSubmit").on("click",function(){
        var name = $("#name").val();
        var phone = $("#phone").val();
        var state = $("#state").val();

        var data = {
            name : name,
            phone : phone,
            state : state
        };
        searchData(1,data);
    });

    $("body").keyup(function (e) {
        if (e.which == 13){
            $("#searchSubmit").trigger("click");
        }
    });

    $(document).on("click",".rlink",function(){
        var id = $(this).data("id");

        reviewData(id);
    });

    $("#reviewSubmit").on("click",function(){
        var id = $(this).data("id");
        var opneAccount = 0;
        var trading = 0;
        var opneAccountBonus = $("#opneAccountBonus");
        var tradingBonus = $("#tradingBonus");
        var isNum=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/; //金额正则

        if($("#opneAccount").prop("checked")){
            var opneAccount = 1;
        }
        if($("#trading").prop("checked")){
            var trading = 1;
        }
        if(!isNum.test(opneAccountBonus.val()) && opneAccountBonus.val() != 0){
            cp.alert({
                content : "请输入正确的金额！"
            });
            opneAccountBonus.focus();
            return;
        }
        if(!isNum.test(tradingBonus.val()) && tradingBonus.val() != 0){
            cp.alert({
                content : "请输入正确的金额！"
            });
            tradingBonus.focus();
            return;
        }
        if(opneAccountBonus.val() == ""){
            cp.alert({
                content : "开户提成不能为空！"
            });
            opneAccountBonus.focus();
            return;
        }
        if(tradingBonus.val() == ""){
            cp.alert({
                content : "交易提成不能为空！"
            });
            tradingBonus.focus();
            return;
        }
        var data = {
            id : id,
            opneAccount : opneAccount,
            opneAccountBonus :  opneAccountBonus.val(),
            trading : trading,
            tradingBonus: tradingBonus.val()
        };

        submitReview(data);
    });

    function searchData(page,query){
        $.ajax({
            url : "/admin/distribution",
            type : "post",
            dataType : "json",
            data:{
                page : page,
                name : query.name,
                phone : query.phone,
                state : query.state
            },
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                var htmlT;
                var tdArr = [];
                $("#fxPage").hide();
                if(data.core === 1){
                    var users = data.data;
                    var introducer = data.introducer;
                    var introducerInfo = "无";
                    if(introducer){
                        introducerInfo = introducer.name+"（"+introducer.phone+"）"
                    }

                    htmlT =  "<span>"+ data.user.name+"（"+data.user.phone+"）"+"</span> 的分销信息";
                    $("#resultsTable").show();
                    if(users.length){
                        $.each(users,function(i,n){
                            var htmlCont =
                                '<tr>'+
                                '<td class="no-introducer">'+ introducerInfo +'</td>'+
                                '<td>'+ n.name +'</td>'+
                                '<td>'+ n.phone +'</td>'+
                                '<td>'+ ( n.email || "没有填写" ) +'</td>'+
                                '<td><a href="javascript:" class="rlink" data-id="'+n._id+'">审核</a></td>'+
                                '</tr>';
                            tdArr.push(htmlCont);
                        });
                        $("#fxPage").show();

                    }else{
                        var htmlCont = '<tr><td colspan="4" class="no-data">没有分销信息！</td></tr>';
                        tdArr.push(htmlCont);
                    }
                    $("#resultsTr").html(tdArr.join(""));
                    if(typeof introducer == 'undefined'){
                        $(".no-introducer").hide();
                    }else{
                        $("#fxPage").hide();
                        $(".no-introducer").show();
                    }


                    $("#fxPage").find(".total-page").html(data.total);
                    $("#fxPage").find(".now-page").html(page);
                    fxPage.redirect({
                        nowPage : page,
                        totalPage : data.total
                    },function(page){
                        searchData(page,query)
                    })
                }else{
                    htmlT = "您查询的用户不存在！";
                    $("#resultsTable").hide();
                }

                $(".results-title").show().html(htmlT)
            }
        })
    }

    function reviewData(id){
        $.ajax({
            url : "/admin/review/"+id,
            type : "get",
            dataType : "json",
            beforeSend : function(XMLHttpRequest){
                cp.loading("opne");
            },
            success : function(data){
                cp.loading("close");
                if(data.core === 1){
                    var distribution = data.data;
                    $("#reviewModal").modal('show');
                    if(distribution.opneAccount){
                        $("#opneAccount").prop("checked",true);
                    }else{
                        $("#unOpneAccount").prop("checked",true);
                    }
                    if(distribution.trading){
                        $("#trading").prop("checked",true);
                    }else{
                        $("#unTrading").prop("checked",true);
                    }
                    $("#opneAccountBonus").val(distribution.opneAccountBonus);
                    $("#tradingBonus").val(distribution.tradingBonus);
                    $("#reviewSubmit").attr("data-id",distribution._id);
                }
            }
        })
    }

    function submitReview(data){
        $.ajax({
            url : "/admin/review",
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
                        content : "审核成功！",
                        type : "alert-success"
                    });
                    $("#reviewModal").modal('hide');
                }

            }
        })
    }
});

