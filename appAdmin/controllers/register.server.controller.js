var Register = require('../models/register.server.model.js');

module.exports = {
    view:function(req,res,next){

        res.render('admin/register');

    },
    register:function(req,res,next){
        var data = req.body;
        Register.findOne({phone : data.phone},function(err,regData){
            if(err) console.log(err);
            if(regData){
                console.log(regData)
                res.json({core : 1})
            }else{
                var register = new Register(data);
                register.save();
                res.json({core : 0})
            }
        });

    }
};