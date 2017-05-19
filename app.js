var config = require('./config/config');
var app = require('./config/express')();
var server = require('./config/socket')(app);

server.listen(config.port, function(){
    console.log('app started, listening on port:', config.port);
});