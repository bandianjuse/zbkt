module.exports  = function(app){
    console.log('init socket.io...');
    var System = require('../appAdmin/models/system.server.model');
    var publicFun = require('./publicFun');
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var isArray = function(item,items){
        for(var i in items){
            if(items[i] === item){
                return true;
            }
        }
    };
    
    System.find({},function(err,system){
        if(err) console.log(err);
        var system = publicFun.systemInfo(system);
        var users = {}; //用户列表
        var online = system.consulting.online; //在线人数
        io.on('connection', function (socket){
            socket.on('app', function(item){
                socket.on(item+'message', function(user){
                    io.emit(item+'message', user);
                });
                socket.on(item+'private message', function (from,to,msg) {
                    io.emit(item+'to'+to.id,from);
                    io.emit(item+'from'+from.id,to);
                });
                socket.on(item+'blacklist', function (user) {
                    io.emit(item+'blacklist',user);
                });
                socket.on(item+'come in', function (user) {
                    //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
                    var id = user.id;
                    socket.name = user.name;
                    socket.id = user.id;
                    //users 对象中不存在该用户名则插入该用户名
                    if (!users[id]) {
                        users[id] = id;
                        online++;
                    }

                    io.emit(item+'come in',user,online);
                });
                socket.on('disconnect', function(){
                    //若 users 对象中保存了该用户名
                    if (users[socket.id]) {
                        //从 users 对象中删除该用户名
                        delete users[socket.id];

                        online--;

                        var user = {
                            id : socket.id,
                            name : socket.name
                        };

                        io.emit(item+'exit',user,online);
                    }
                })
            });

        });

    });

    return server;
};
