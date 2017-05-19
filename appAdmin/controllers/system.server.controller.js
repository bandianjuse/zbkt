var Usuer = require('../../app/models/user.server.model');
var System = require('../models/system.server.model');

module.exports = {
    system:function(req,res,next){
        Usuer.find({type : 1},function(err,user){
            if(err) console.log(err);
            if(user.length){
                System.find({},function(err,system){
                    if(err) console.log(err);

                    res.render('admin/system',{
                        basis: system[0].value,
                        times : system[1].value,
                        live : system[2].value,
                        consulting : system[3].value,
                        users : user
                    });

                });

            }
        });

    },
    update:function(req,res,next){
        var data = req.body;
        var query = {item : data.item};
        System.findOne(query,function(err,system){
            if(err) console.log(err);
            if (system) {
                var set = {
                    value : JSON.parse(data.value)
                };
                System.update(query,{$set:set},function(err,data){
                    if(err) console.log(err);
                    if(data.ok == 1){
                        res.json({core : 1, })
                    }
                })
            }
        })

    }
};