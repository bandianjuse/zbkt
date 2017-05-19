function Page(id){
    this.nowPage = 1;
    this.totalPage = 1;
    this.callback = function(){};

    var first = $(id).find(".first");
    var prev = $(id).find(".prev");
    var next = $(id).find(".next");
    var last = $(id).find(".last");
    var _this = this;
    var event = function(obj){
        obj.on("click",function(){
            var page = 1;
            if($(this).hasClass("prev")){
                _this.nowPage == 1 ? page = _this.nowPage : page = parseInt(_this.nowPage) - 1;
            }else if($(this).hasClass("next")){
                _this.nowPage == _this.totalPage ? page = _this.nowPage : page = parseInt(_this.nowPage) + 1
            }else if($(this).hasClass("last")){
                page = _this.totalPage;
            }

            _this.callback(page);
        })
    };
    event(first);
    event(prev);
    event(next);
    event(last);
}

Page.prototype.redirect = function(object,callback){
    this.nowPage = object.nowPage;
    this.totalPage = object.totalPage;
    this.callback =  callback;
};
