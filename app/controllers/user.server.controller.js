var User = require('../models/user.server.model');
var Distribution = require('../../appAdmin/models/distribution.server.model');
var System = require('../../appAdmin/models/system.server.model');
var config = require('../../config/config');
var publicFun = require('../../config/publicFun');
var OAuth = require('wechat-oauth'); //微信公共平台OAuth接口

module.exports = {
    view:function(req,res,next){
        var appid = config.weixin.appid;
        var appsecret = config.weixin.appsecret;
        var client = new OAuth(appid,appsecret);
        var id = req.query.state; //分享者id
        var code = req.query.code; //微信code

        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            var system = publicFun.systemInfo(system);

            //存在微信code，调用微信用户信息，不存在刚调用错误页面
            if(code){
                client.getAccessToken(code, function (err, ret) {
                    try{
                        var accessToken = ret.data.access_token;
                        var openid = ret.data.openid;
                        client.getUser({openid: openid, lang: "zh_CN"}, function (err, result) {

                            try{
                                var userInfo = result;
                                var query  = User.where({  openid : userInfo.openid});
                                query.findOne(function(err, user){
                                    if(err) return next(user);

                                    //如果用户openid已经存在，说明已经注册过，更新用户信息并重定向到/live
                                    if(user){
                                        if(user.phone != "10000000000"){
                                            var set = {
                                                name : userInfo.nickname,
                                                portrait : userInfo.headimgurl,
                                                region : userInfo.province+" "+userInfo.city
                                            };

                                            query.update({$set:set},function(err,data){
                                                if (err) return next(err);
                                                if(data.ok == 1){
                                                    query.findOne(function (err, newUser) {
                                                        if (err) return next(err);
                                                        req.session.user = newUser;

                                                        var url = timeJump(system.time,newUser._id);
                                                        res.redirect(url)
                                                    })
                                                }
                                            })
                                        }else{
                                            res.render('phone/index',{
                                                id : id,
                                                wx : JSON.stringify(userInfo),
                                                info : system
                                            });
                                        }

                                    }else{
                                        //不存在openid

                                        if(id == "1"){
                                            var userData = {
                                                openid : result.openid,
                                                phone :"10000000000",
                                                name : result.nickname,
                                                region : result.province+" "+result.city,
                                                portrait : result.headimgurl
                                            };
                                        }else{
                                            var userData = {
                                                openid : result.openid,
                                                phone :"10000000000",
                                                name : result.nickname,
                                                region : result.province+" "+result.city,
                                                portrait : result.headimgurl,
                                                introducer : id
                                            };
                                        }
                                        var user = new User(userData);
                                        user.save(function(err,data){
                                            req.session.user = data;
                                            var url = timeJump(system.time,data._id);
                                            res.redirect(url);
                                        });
                                    }
                                })
                            }catch (e){
                                console.log(e.name + ": " + e.message);
                            }
                        });
                    }catch (e){
                        console.log(e.name + ": " + e.message);
                    }

                });


            }else{
                res.render('phone/pc');
            }

        });
    },
    ykLogin : function(req,res,next){
        var user = req.session.user;
        console.log(user);
        var userInfo = {
            openid : user.openid,
            nickname : user.name,
            region : user.region,
            headimgurl : user.portrait
        };
        //全局配置信息
        System.find({},function(err,system) {
            if (err) console.log(err);
            var system = publicFun.systemInfo(system);

            res.render('phone/index',{
                id : user._id,
                wx : JSON.stringify(userInfo),
                info : system
            });
        })

    },
    login: function(req,res,next){
        var id = req.body.id;
        var phone = req.body.phone;
        var wx = JSON.parse(req.body.wx);

        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            var system = publicFun.systemInfo(system);

            var query  = User.where({  openid : wx.openid });
            query.findOne(function (err, user) {
                if (err) return next(err);
                if (user) {
                    console.log("存在此用户");
                    var set = {
                        openid : wx.openid,
                        phone : phone,
                        name : wx.nickname,
                        region : wx.region,
                        portrait : wx.headimgurl
                    };
                    query.update({$set:set},function(err,data){
                        if (err) return next(err);
                        console.log("更新后的返回值："+JSON.stringify(data));
                        if(data.ok == 1){
                            query.findOne(function (err, newUser) {
                                console.log("再次查找返回值："+newUser);
                                if (err) return next(err);
                                req.session.user = newUser;
                                var url = timeJump(system.time,newUser._id);
                                return res.json({data:newUser,url : url});
                            })
                        }
                    });
                    //保存分销信息
                    var distribution = new Distribution({userId : user._id});
                    distribution.save();

                }else{
                    if(id == "no"){
                        var userData = {
                            openid : wx.openid,
                            phone :phone,
                            name : wx.nickname,
                            region : wx.region,
                            portrait : wx.headimgurl
                        };
                    }else{
                        var userData = {
                            openid : wx.openid,
                            phone :phone,
                            name : wx.nickname,
                            region : wx.region,
                            portrait : wx.headimgurl,
                            introducer : id
                        };
                    }

                    var user = new User(userData);
                    user.save(function(err,data){
                        req.session.user = data;
                        var url = timeJump(system.time,data._id);

                        return res.json({data : data,url:url});
                    });


                }
            });
        })

    },
    details : function(req,res,next){
        var user = req.session.user;

        //全局配置信息
        System.find({},function(err,system){
            if(err) console.log(err);
            try{
                var system = publicFun.systemInfo(system);
                var data = {
                    id  : user.id,
                    name : user.name,
                    portrait : user.portrait,
                    type : user.type,
                    region : user.region,
                    phone : user.phone,
                    email : user.email,
                    blacklist : user.blacklist
                };
                res.render('phone/user',{
                    user : data,
                    playbackId : config.playbackId,
                    openAccountLink : config.openAccountLink,
                    tradingLink : config.tradingLink,
                    info :system
                });
            }catch (e){
                console.log(e.name + ": " + e.message);
            }

        })


    },
    wealth : function(req,res,next){
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
                    type : user.type,
                    region : user.region,
                    phone : user.phone,
                    email : user.email,
                    blacklist : user.blacklist
                };
                User
                    .find({introducer : user._id})
                    .exec(function(err, dataList){
                        if(err) return next(err);
                        if(!dataList) return next(new Error('User not Found'));
                        var distributionArr = [];
                        for(var i=0;i<dataList.length;i++){
                            var distributionId = dataList[i]['_id'];
                            distributionArr.push(distributionId);
                        }

                        Distribution.find({userId : {$in : distributionArr}},function(err,distribution){
                            if(err) console.log(err);
                            var distributionTotal = 0;
                            for(var i=0;i<distribution.length;i++){
                                var tradingBonus = parseFloat(distribution[i]['tradingBonus']);
                                var opneAccountBonus = parseFloat(distribution[i]['opneAccountBonus']);
                                distributionTotal += tradingBonus + opneAccountBonus;
                            }
                            res.render('phone/wealth',{
                                user : data,
                                playbackId : config.playbackId,
                                openAccountLink : config.openAccountLink,
                                tradingLink : config.tradingLink,
                                dataList :dataList,
                                info :system,
                                distribution : distribution,
                                distributionTotal : distributionTotal.toFixed(2)
                            });
                        });

                    });
            }catch(e){
                console.log(e.name + ": " + e.message);
            }

        })


    },
    saveUser : function(req,res,next){
        var user = req.body;
        var id = user.id;

        var set = {
            name:user.name,
            portrait:user.portrait,
            region: user.region,
            email:user.email
        };
        user._id = id;
        User.update({_id:id},{$set:set},function(err,data){
            if(data.ok == 1){
                req.session.user = user;
                res.json({core:"1",data:user});
            }else{
                res.json({core:"0",data:user});
            }
        });
    },
    logout : function(req,res,next){
        delete req.session.user;
        res.json({core:"1"});
    }
};


/*
******************
* 时间区间跳转器
* *****************
*/
function timeJump(time,id){
    var nowTime = getTime();
    for(var i = 0; i < time.length; i++){
        var t = time[i];
        var startTime = changeTime(t.start);
        var endTime = changeTime(t.end);
        var url = isUrl(t.type);
        if(startTime < endTime){
            if(nowTime >= startTime && nowTime <= endTime){
                return url+id;
            }
        }else{
            if((nowTime >= startTime && nowTime <= 2359) || (nowTime >= 0 && nowTime <= endTime)){
                return url+id;
            }
        }
        // url = isUrl("视频回放");
        // return url+id;
    }
}

function changeTime(time){
    var timeArr = time.split(":");
    var time1 = timeArr[0];
    var time2 = timeArr[1];
    if(time1 < 10 && time1 != 0){
        if(time1.indexOf("0") != 0){
            time1 = "0"+ time1;
        }
    }
    if(time2 < 10 && time2 != 0){
        if(time2.indexOf("0") != 0){
            time2 = "0"+time2;
        }
    }
    var newTime = "" + time1 + time2;

    return newTime;
}
function getTime(){
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    if(hours < 10){
        hours = "0"+hours.toString();
    }
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }
    var nowTime = hours.toString() + minutes.toString();
    nowTime = parseInt(nowTime);
    return nowTime;
}
function isUrl(type){
    if(type == "客服咨询"){
        return "/consulting/";
    }else if(type == "直播课堂"){
        return "/live/"
    }else{
        return "/playback/"+config.playbackId+"/fx/";
    }
}
