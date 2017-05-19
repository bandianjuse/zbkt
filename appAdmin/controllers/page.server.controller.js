var Page = require('../../app/models/page.server.model');


module.exports = {
    page:function(req,res,next){
        Page.findOne({title : "关于我们"},function(err,about){
            if(err) console.log(err);
            Page.findOne({title : "免责声明"},function(err,statement){
                if(err) console.log(err);
                Page.findOne({title : "服务中心"},function(err,service){
                    if(err) console.log(err);
                    res.render('admin/page',{
                        about : about.content,
                        statement : statement.content,
                        service : service.content
                    });
                });
            });
        });



    },
    update:function(req,res,next){
        var data = req.body;
        var query = {title : data.title};
        Page.update(query,{$set : {content : data.content}},function(err,results){
            if(err) console.log(err);
            console.log(results);
            res.json({core : 1, })
        })

    }
};