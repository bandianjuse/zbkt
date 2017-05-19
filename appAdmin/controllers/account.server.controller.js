var User = require('../../app/models/user.server.model');
var Admin = require('../models/admin.server.model');
var crypto = require('crypto');

module.exports = {
    list:function(req,res,next){
        res.render('admin/account');

    },
    account : function(req,res,next){
        var page = req.body.page;
        var type = req.body.type;
        var query = JSON.parse(req.body.query);
        var limit = 10;

        if(query == 1){
            query = {};
        }

        if(type == 1){
            User.count(query,function(err,count){
                var total = count % limit ? parseInt(count / limit) + 1 : parseInt(count / limit);

                User.find(query,function(err,users){
                    if(err) console.log(err);
                    res.json({core:1,data:users,total : total});
                }).sort({_id:-1}).limit( limit ).skip( limit * (page - 1));

            });
        }else if(type == 2){

            Admin.count(query,function(err,count){
                var total = count % limit ? parseInt(count / limit) + 1 : parseInt(count / limit);

                Admin.find(query,function(err,admin){
                    if(err) console.log(err);
                    res.json({core:1,data:admin,total : total});
                }).sort({_id:-1}).limit( limit ).skip( limit * (page - 1));

            });
        }

    },
    user : function(req,res,next){
        var id = req.params.id;
        User.findOne({_id : id},function(err,user){
            if(err) console.log(err);
            if(user){
                res.json({core : 1, data : user})
            }
        })
    },
    updateuser : function(req,res,next){
        var id = req.body.id;
        var blacklist = parseInt(req.body.blacklist);
        var type = parseInt(req.body.type);
        var set = {
            blacklist : blacklist,
            type : type
        };
        User.update({_id : id},{$set : set },function(err,update){
            if(err) console.log(err);
            if(update.ok == 1){
                res.json({core : 1});
            }
        })
    },
    updateadmin : function(req,res,next){
        var id = req.body.id;
        var password = parseInt(req.body.password);

        var md5Password = encryptUtils(JSON.stringify(password));
        var set = {
            password : md5Password
        };
        console.log(md5Password);
        Admin.update({_id : id},{$set : set },function(err,update){
            if(err) console.log(err);
            if(update.ok == 1){
                res.json({core : 1});
            }
        })
    },
    deladmin : function(req,res,next){
        var id = req.body.id;

        Admin.remove({_id : id},function(err,results){
            if(err) console.log(err);
            res.json({core : 1});
        });

    },
    saveadmin : function(req,res,next){
        var data = req.body;
        var name = req.body.name;
        Admin.findOne({name : name},function(err,results){
            if(err) console.log(err);
            if(!results){
                var admin = new Admin(data);
                admin.save(function(){
                    res.json({core : 1});
                })
            }else{
                res.json({core : 0});
            }
        })


    }
};

/**
 * MD5加密
 * @param data
 * @returns {*}
 */
function encryptUtils(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}