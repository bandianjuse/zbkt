var Page = require('../models/page.server.model');
var System = require('../../appAdmin/models/system.server.model');
var publicFun = require('../../config/publicFun');
var config = require('../../config/config');
module.exports = {
    about : function(req,res,next){
        page(req,res,next,"关于我们");
    },
    statement: function(req,res,next){
        page(req,res,next,"免责声明");
    },
    service: function(req,res,next){
        page(req,res,next,"服务中心");
    },
    save : function(req,res,next){
        var data = {
            title : "免责声明",
            //content : "<p>1.以上所展示的信息由企业自行提供，内容的真实性、准确性和合法性由发布企业负责。金泉网对此不承担任何保证责任。</p><p>2.如果以上产品侵犯您的版权或者非企业授权发布，请联系金泉网(0595-86722273),我们会在24小时内审核处理。</p><p>3.在线留言评论代表使用该企业产品的个人观点，如果不需要显示的留言或评论，金铺网站管理员可以自行删除，或者联系金泉网(0595-86722273)删除。</p><p>4.金泉网只提供产品信息，一切交易将视为客户自行自愿交易，对交易风险由交易双方自行负责，金泉网对此不承担任何保证责任。</p>"
            content:"免责声明内容"
        };
        var page = new Page(data);
        page.save();
        console.log("ok")
    }
};

function page(req,res,next,title){
    var user = req.session.user;
    //全局配置信息
    System.find({},function(err,system){
        if(err) console.log(err);
        try{
            var system = publicFun.systemInfo(system);
            var data = {
                id  : user._id,
                name : user.name,
                portrait : user.portrait,
            };
            var query = {
                title: title
            };
            Page.findOne(query, function (err, page) {
                if (err) return next(err);
                if (page) {
                    res.render('phone/page', {
                        title: page.title,
                        content: page.content,
                        user:data,
                        playbackId : config.playbackId,
                        openAccountLink : config.openAccountLink,
                        tradingLink : config.tradingLink,
                        info :system
                    });
                }
            })
        }catch (e){
            console.log(e.name + ": " + e.message);
        }

    })

}

