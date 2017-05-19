
$(function(){
    $.init();

    // 加载flag
    var loading = false;

    // 最多可加载的条目
    var maxItems = parseInt($("#count").val());
    // 每次加载添加多少条
    var pagesize = 10;

    // 从哪页开始加载
    var pagestart = 1;

    // 上次加载的序号
    var lastIndex = 10;

    // function addItems(number, lastIndex) {
    //     // 生成新条目的HTML
    //     var html = '';
    //     for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
    //         html +=
    //             '<li>' +
    //             '<div class="left">' +
    //             '<img src="/images/pb_pic.jpg" >' +
    //             '</div>' +
    //             '<div class="right">' +
    //             '<h4>汇中微讲座第5期</h4>' +
    //             '<div class="nr">2009年秋天，华尔街正在进行着规模巨大的整休工程，与此同时...</div>' +
    //             '<div>' +
    //             '<a href="/playback/1" class="pb-btn">观看回放</a>' +
    //             '</div>' +
    //             '</div>' +
    //             '</li>';
    //     }
    //     // 添加新条目
    //     $('.infinite-scroll-bottom .list-container').append(html);
    //
    // }
    //预先加载10条
    getList(pagesize, pagestart);

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom',function() {
        // 如果正在加载，则退出
        if (loading) return;
        // 设置flag
        loading = true;

        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;

            if (lastIndex >= maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('.infinite-scroll'));
                // 删除加载提示符
                $('.infinite-scroll-preloader').remove();
                return;
            }

            pagestart++;

            // 添加新条目
            getList(pagesize, pagestart);

            // 更新最后加载的序号
            lastIndex = $('.list-container li').length;
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });

    //验证游客身份
    authenticate()
});

function getList(pagesize,pagestart){
    $.ajax({
        url : "/playback",
        type:"post",
        dataType : "json",
        async: false,
        data : {
            pagestart : pagestart,//从第几页开始
            pagesize : pagesize //每页显示条数
        },
        beforeSend : function(XMLHttpRequest){
            $(".preloader").show();
        },
        success : function(data){
            $(".preloader").hide();
            if(data.core == "1"){
                var items = data.data;
                console.log(items);
                var html = '';
                $.each(items,function(i,n){
                    html +=
                        '<li>' +
                        '<div class="left">' +
                        '<img src="/'+n.thumbnail+'" >' +
                        '</div>' +
                        '<div class="right">' +
                        '<h4>'+n.title+'</h4>' +
                        '<div class="nr">'+n.introduce+'</div>' +
                        '<div>' +
                        '<a href="/playback/'+n._id+'" class="pb-btn">观看回放</a>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                });
                // 添加新条目
                $('.infinite-scroll-bottom .list-container').append(html);
            }else{
                $.toast("没有找到回放视频");
            }

        }
    })
}

//验证游客身份
function authenticate(){
    var time = 180000;  //3分钟
    if($("#phone").val() == "10000000000"){
        $("#tabMenu").unbind();
        $(".icon-caret").remove();
        setTimeout(render,time);
    }

    function render(){
        var text = "您的权限不足，请先进行注册！";
        $.alert(text, function(){
            window.location.href = "/login";
        });
    }
}
