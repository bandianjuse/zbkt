var Admin = require('../../appAdmin/models/admin.server.model.js');
var crypto = require('crypto');

module.exports = {
    login:function(req,res,next){
        var admin = req.session.admin;
        if(admin){
            res.redirect("/admin/system");
        }else{
            res.render('admin/login');
        }
    },
    validation:function(req,res,next){
        var name = req.body.name;
        var password = req.body.password;
        var query  = Admin.where({  name : name });
        var md5Password = encryptUtils(password);

        console.log(md5Password);
        query.findOne(function (err, admin) {
            if (err) next(err);

            if (admin) {
                if(admin.password === md5Password){
                    req.session.admin = admin;
                    res.json({core : 0}); //成功
                }else{
                    res.json({core : -1}); //密码错误
                }
            }else{
                res.json({core : -2}); //用户不存在
            }
        });
    },
    save : function(req,res,next){
        var name = req.body.name;
        var password = req.body.password;
        md5.update(password);//进行md5加密
        var md5Password = md5.digest('hex');// 获得加密后的密码
        var data = {
            name : name,
            password : md5Password
        };
        var admin = new Admin(data);
        admin.save();
    },
    logout : function(req,res,next){
        console.log("111111111111");
        delete req.session.admin;
    },
    welcome:function(req,res,next){
        console.log(1111)
        res.render('admin/welcome');
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