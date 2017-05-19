var Playback = require('../models/playback.server.model');
var System = require('../../appAdmin/models/system.server.model');
var publicFun = require('../../config/publicFun');
var config = require('../../config/config');

module.exports = {
    view:function(req,res,next){
        var user = req.session.user;
        var id = req.params.id;
        if(!user) return next(error);
        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            var system = publicFun.systemInfo(system);

            Playback.find({},function(err,count){
                    var count = count.length;
                    if(count){
                        Playback.findOne({_id:id},function(err,playback){
                                try{
                                    res.render('phone/playback',{
                                        user:{
                                            id : user._id,
                                            name:user.name,
                                            portrait:user.portrait,
                                        },
                                        phone :  user.phone,
                                        playbackId : config.playbackId,
                                        openAccountLink : config.openAccountLink,
                                        tradingLink : config.tradingLink,
                                        count:count,
                                        url : playback.url,
                                        info :system
                                    });
                                }catch(e){
                                    console.log(e.name + ": " + e.message);
                                }

                            });
                    }

                })
        })



    },
    list:function(req,res,next){
        var pagesize = parseInt(req.body.pagesize) || 10;
        var pagestart = parseInt(req.body.pagestart) || 1;
        Playback
            .find()
            // 搜索时，跳过的条数
            .skip( (pagestart - 1) * pagesize )
            // 获取的结果集条数
            .limit(pagesize)
            .exec(function(err, data){
                if(err) next(err);

                res.json({core : "1",data : data});
            });
    },
    save:function(req,res,next){

        var playback = new Playback({
            title: "回放视频",
            thumbnail: "/phone/images/1.png",
            url: "video/22.mp4",
            introduce: "汇中微交易何老师课堂干货分享",
        });
        playback.save();

    }
};
