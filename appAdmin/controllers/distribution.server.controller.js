var Distribution = require('../../appAdmin/models/distribution.server.model.js');
var User = require('../../app/models/user.server.model.js');
module.exports = {
    list:function(req,res,next){
        res.render('admin/distribution');

    },
    search : function(req,res,next){
        var page = req.body.page;
        var state = req.body.state;
        var name = req.body.name;
        var phone = req.body.phone;
        var query = {};
        var limit = 10;

        if(name != "") query.name = name;
        if(phone != "") query.phone = phone;
        if(name == "" && phone == ""){
            query.name = name;
            query.phone = phone;
        }

        User.findOne(query,function(err,user){
            if(err) console.log(err);
            if(user){
                var userId = user._id;
                var introducer = user.introducer;
                var userInfo = {
                    name : user.name,
                    phone : user.phone
                };
                if(state == 1){
                    
                    var users = [];
                    users.push(user);

                    User.findOne({_id :introducer },function(err,u){
                        if(err) console.log(err);
                        if(u){
                            var introducerInfo = {
                                name : u.name,
                                phone : u.phone
                            };
                        }else{
                            var introducerInfo = 0;
                        }
                        res.json({core : 1,data:users,user:userInfo,introducer : introducerInfo});
                    })
                }else{
                 
                    User.count({introducer :userId },function(err,count){
                        var total = count % limit ? parseInt(count / limit) + 1 : parseInt(count / limit);

                        User.find({introducer :userId },function(err,users){
                            if(err) console.log(err);

                            res.json({core:1,data:users,user:userInfo,total : total});
                        }).limit( limit ).skip( limit * (page - 1));

                    });
                }
            }else{
                res.json({core : 0});
            }
        })
        
    },
    reviewList : function(req,res,next){
        var id = req.params.id;
        Distribution.findOne({userId : id},function(err,distribution){
            if(err) console.log(err);
            if(distribution){
                res.json({core : 1, data : distribution})
            }else{
                var data = {
                    userId : id
                };
                var distrib = new Distribution(data);
                distrib.save(function(err,data){
                    if(err) console.log(err);
                    res.json({core : 1, data : data})
                })
            }
        })

    },
    reviewSubmit : function(req,res,next){
        var id = req.body.id;
        var set = {
            opneAccount : req.body.opneAccount,
            opneAccountBonus :  req.body.opneAccountBonus,
            trading : req.body.trading,
            tradingBonus: req.body.tradingBonus
        };

        Distribution.update({_id : id},{$set:set},function(err,distribution){
            if(err) console.log(err);
            if(distribution.ok == 1){
                res.json({core : 1});
            }
        })
    }
};