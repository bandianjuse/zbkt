var User = require('../models/user.server.model');
var System = require('../../appAdmin/models/system.server.model');
var publicFun = require('../../config/publicFun');
var config = require('../../config/config');
module.exports = {
    view:function(req,res,next){
        var user = req.session.user;
        if(!user) return next(error);
        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            var system = publicFun.systemInfo(system);
            var data = {
                id  : user._id,
                name : user.name,
                phone :  user.phone,
                portrait : user.portrait,
                type : user.type,
                blacklist : user.blacklist
            };
            User.findOne({_id :system.live.admin },function(err,admin){
                if(err) console.log(err);
                if(admin){
                    res.render('phone/live',{
                        user : data,
                        playbackId : config.playbackId,
                        openAccountLink : config.openAccountLink,
                        tradingLink : config.tradingLink,
                        info : system,
                        admin : {
                            id : admin._id,
                            name : admin.name,
                            portrait : admin.portrait,
                            type : admin.portrait
                        }
                    });
                }
            });

        })


    },
    blacklist:function(req,res,next){
        var id = req.body.id;
        User.update({_id:id},{$set:{blacklist:'1'}},function(err){
            res.json({core:"1"});
        });

    },
    consulting: function(req,res,next){
        var user = req.session.user;
        if(!user) return next(error);

        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            var system = publicFun.systemInfo(system);
            var data = {
                id  : user._id,
                name : user.name,
                phone :  user.phone,
                portrait : user.portrait,
                type : user.type,
                blacklist : user.blacklist
            };

            User.findOne({_id :system.consulting.admin },function(err,admin){
                if(err) console.log(err);
                if(admin){
                    res.render('phone/consulting',{
                        user:data,
                        playbackId : config.playbackId,
                        openAccountLink : config.openAccountLink,
                        tradingLink : config.tradingLink,
                        info : system,
                        admin : {
                            id : admin._id,
                            name : admin.name,
                            portrait : admin.portrait,
                            type : admin.portrait
                        }
                    });
                }
            })
        })


    }
};
