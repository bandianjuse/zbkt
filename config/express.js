module.exports  = function(){
  console.log('init expesss...');
  var express = require('express');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var mongoose = require('mongoose');
  var mongoStore = require('connect-mongo')(session);
  //var RedisStore = require('connect-redis')(session);
  var cookieParser = require('cookie-parser');
  var log4js = require('log4js');
  var config = require('./config');
  var wechat = require('wechat');
  var app = express();
  var router = express.Router();

  // 设置日志
  log4js.configure({
    appenders: [
      { type: 'console' },
      {
        type: 'file', //文件输出
        filename: config.logsPath,
        maxLogSize: 1024,
        backups:3,
        category: 'normal'
      }
    ],
    replaceConsole: true
  });
  var logger = log4js.getLogger();
  logger.setLevel('INFO');

  app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

  // 连接mongodb
  mongoose.connect(config.mongodb);

  //设置视图模板路径
  app.set('views', './public');

  //设置使用ejs模板引擎
  app.set('view engine', 'ejs');

  //加载处理json数据中间件
  app.use(bodyParser.json());

  //加载UTF-8的编码的数据中间件
  app.use(bodyParser.urlencoded({extended: false }));

  //设置静态资源路径
  app.use(express.static("./public"));

  //设置 Cookie
  app.use(cookieParser());

  //设置 redis
 /* app.use(session({
    secret: 'huizhong',
    store: new RedisStore(config.redis),
    resave: false,
    saveUninitialized: true,
  }));*/

  //设置 Session
  app.use(session({
    secret: 'huizhong',
    // cookie: {maxAge: 3600000 },  //一小时失效
    store: new mongoStore({
      url: config.mongodb
    }),
    resave: false,
    saveUninitialized: true
  }));

  //微信验证服务端信息
  app.use('/wechat', wechat('huizhong', function (req, res, next) {
    var message = req.weixin;
    console.log(message);
  }));

  //图片上传
  require('./upload')(app);

  //登录拦截器
  app.use(function (req, res, next) {
    var url = req.originalUrl;
    var id = "1"; //分享者id

    if(url != "/" && !req.session.user && url.indexOf("/?code") == -1 && url.indexOf("/admin/") == -1 && url.indexOf("/register/") == -1 && url.indexOf("/favicon.ico") == -1){
      //拦截从用户分享过来的url,获取分享者id
      if(url.indexOf("/live") != -1){
        id = url.substr(url.indexOf("/live/")+6,24); //从url中提取id值
      }else if(url.indexOf("/playback") != -1){
        id = url.substr(url.indexOf("/fx/")+4,24); //从url中提取id值
      }else if(url.indexOf("/consulting") != -1){
        id = url.substr(url.indexOf("/consulting/")+12,24);
      }else if(url.indexOf("/wealth") != -1){
        id = url.substr(url.indexOf("/wealth/")+8,24);
      }
      var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.weixin.appid+"&redirect_uri="+config.weixin.redirectUrl+"&response_type=code&scope=snsapi_userinfo&state="+id+"#wechat_redirect";
      res.redirect(url);
    }

    if(url != "/admin/" && url != "/register/" && !req.session.admin && url.indexOf("/admin/") != -1){
      console.log("inin");
      var url = "/admin/";
      res.redirect(url);
    }
    
    next();

  });

  //加载前端路由
  console.log("initialize the front-end routing:");
  var routesPhone = config.routes.phone;
  for(var key in routesPhone){
    require(routesPhone[key])(app);
    console.log(routesPhone[key]);
  }

  //加载后端路由
  var routesAdmin = config.routes.admin;
  console.log("initialize the back-end routing:");
  for(var key in routesAdmin){
    require(routesAdmin[key])(router,app);
    console.log(routesAdmin[key]);
  }
  app.use('/admin',router); //后端路由挂载到‘/admin’下

  //处理所有未知的请求404
  app.use(function(req, res, next){
    res.status(404);
    try {
      return res.json('Not Found');
    } catch(e) {
      console.error('404 set header after sent');
    }
  });

  //统一处理出错的情况500
  app.use(function(err, req, res, next){
    if(!err) {return next()}
    res.status(500);
    try {
      return res.json(err.message || 'server error');
    } catch(e) {
      console.error('500 set header after sent');
    }
  });

  return app;
};